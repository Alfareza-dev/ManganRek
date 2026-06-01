import { Injectable, NotFoundException, BadRequestException, ForbiddenException, InternalServerErrorException, forwardRef, Inject } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ValidateVoucherDto } from './dto/validate-voucher.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { RestaurantsService } from '../restaurants/restaurants.service';

@Injectable()
export class PosService {
  constructor(
    private prisma: PrismaService,
    private restaurantsService: RestaurantsService
  ) {}

  async validateVoucher(cashierId: string, dto: ValidateVoucherDto) {
    const cashier = await this.prisma.user.findUnique({
      where: { id: cashierId }
    });

    if (!cashier || !cashier.managedRestoId) {
      throw new ForbiddenException('Akses ditolak: Kasir tidak terdaftar pada restoran manapun');
    }

    const tx = await this.prisma.transaction.findUnique({
      where: { uniqueCode: dto.uniqueCode },
      include: { voucher: true }
    });

    if (!tx || !tx.voucher) {
      throw new NotFoundException('Kode voucher tidak ditemukan');
    }

    if (tx.status !== 'PAID') {
      if (tx.status === 'USED') throw new BadRequestException('Voucher ini sudah pernah digunakan');
      throw new BadRequestException('Voucher belum lunas / tidak valid');
    }

    if (tx.voucher.restaurantId !== cashier.managedRestoId) {
      throw new ForbiddenException('Kode voucher ini tidak berlaku di restoran Anda');
    }

    if (new Date() > tx.voucher.expiryDate) {
      throw new BadRequestException('Voucher sudah kadaluarsa');
    }

    // Pengecekan saja, tidak langsung mengubah status menjadi USED
    return {
      transactionId: tx.id,
      voucherTitle: tx.voucher.title,
      value: tx.voucher.value,
      status: 'VALID'
    };
  }

  async getMenus(cashierId: string) {
    const cashier = await this.prisma.user.findUnique({
      where: { id: cashierId }
    });

    if (!cashier || !cashier.managedRestoId) {
      throw new ForbiddenException('Akses ditolak: Kasir tidak terdaftar pada restoran manapun');
    }

    const menus = await this.prisma.menu.findMany({
      where: { restaurantId: cashier.managedRestoId }
    });

    return this.restaurantsService.applyPromosToMenus(menus);
  }

  async createOrder(cashierId: string, dto: CreateOrderDto) {
    const cashier = await this.prisma.user.findUnique({
      where: { id: cashierId }
    });

    if (!cashier || !cashier.managedRestoId) {
      throw new ForbiddenException('Akses ditolak: Kasir tidak terdaftar pada restoran manapun');
    }

    const managedRestoId = cashier.managedRestoId;

    const menuIds = dto.items.map(i => i.menuId);
    const menus = await this.prisma.menu.findMany({
      where: { id: { in: menuIds }, restaurantId: managedRestoId }
    });

    if (menus.length !== menuIds.length) {
      throw new BadRequestException('Beberapa menu tidak valid atau bukan milik restoran ini');
    }

    let totalAmount = 0;
    const orderItemsData = dto.items.map(item => {
      const menu = menus.find(m => m.id === item.menuId);
      if (!menu) throw new BadRequestException('Menu tidak ditemukan');
      const price = menu.price;
      totalAmount += price * item.quantity;
      return {
        menuId: item.menuId,
        quantity: item.quantity,
        price: price
      };
    });

    let discount = 0;
    let validTxId: string | undefined;

    if (dto.voucherCode) {
      const tx = await this.prisma.transaction.findUnique({
        where: { uniqueCode: dto.voucherCode },
        include: { voucher: true }
      });

      if (!tx || !tx.voucher) {
        throw new NotFoundException('Kode voucher tidak ditemukan');
      }

      if (tx.status !== 'PAID') {
        if (tx.status === 'USED') throw new BadRequestException('Voucher ini sudah pernah digunakan');
        throw new BadRequestException('Voucher belum lunas / tidak valid');
      }

      if (tx.voucher.restaurantId !== managedRestoId) {
        throw new ForbiddenException('Kode voucher ini tidak berlaku di restoran Anda');
      }

      if (new Date() > tx.voucher.expiryDate) {
        throw new BadRequestException('Voucher sudah kadaluarsa');
      }

      discount = tx.voucher.value;
      validTxId = tx.id;
    }

    if (discount > totalAmount) {
      discount = totalAmount; // Prevent negative finalAmount
    }

    const finalAmount = totalAmount - discount;

    const orderStatus = dto.paymentMethod === 'CASH' ? 'SETTLED' : 'PENDING';

    const order = await this.prisma.$transaction(async (prisma) => {
      const newOrder = await prisma.order.create({
        data: {
          restaurantId: managedRestoId,
          cashierId: cashier.id,
          customerName: dto.customerName,
          totalAmount,
          discount,
          finalAmount,
          paymentMethod: dto.paymentMethod,
          status: orderStatus,
          items: {
            create: orderItemsData
          }
        },
        include: { items: true }
      });

      if (validTxId) {
        await prisma.transaction.update({
          where: { id: validTxId },
          data: { status: 'USED' }
        });
      }

      return newOrder;
    });

    if (dto.paymentMethod === 'CASH') {
      return {
        success: true,
        message: 'Order berhasil dibayar dengan CASH',
        order
      };
    } else if (dto.paymentMethod === 'QRIS') {
      try {
        const res = await fetch("https://api.louvin.dev/create-transaction", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.LOUVIN_API_KEY || ""
          },
          body: JSON.stringify({
            amount: finalAmount,
            payment_type: "qris",
            reference: order.id
          })
        });

        const louvinData = await res.json();
        
        // Mock data logic in case Louvin API fails / not real
        let qr_string = "MOCK_QR_STRING_" + order.id;
        if (res.ok && louvinData.success && louvinData.payment && louvinData.payment.qr_string) {
           qr_string = louvinData.payment.qr_string;
        } else if (!res.ok) {
           // As requested, assume it works or handle mock gracefully
           console.log("Louvin API response not OK, using mock QR", louvinData);
        }

        return {
          success: true,
          message: 'Order dibuat. Silakan scan QRIS.',
          order,
          qr_string
        };
      } catch (err: any) {
        console.error("Error calling Louvin API", err);
        // Fallback mock
        return {
          success: true,
          message: 'Order dibuat. Silakan scan QRIS (Mock fallback due to network error).',
          order,
          qr_string: "MOCK_QR_STRING_FALLBACK_" + order.id
        };
      }
    }
  }

  async getOrderHistory(cashierId: string) {
    return this.prisma.order.findMany({
      where: { cashierId },
      orderBy: { createdAt: 'desc' },
      include: { items: { include: { menu: { select: { name: true } } } } }
    });
  }

  async verifyMockOrder(orderId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order tidak ditemukan');
    
    if (order.status !== 'PENDING') {
      throw new BadRequestException('Order tidak dalam status PENDING');
    }

    return this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'SETTLED' }
    });
  }
}

