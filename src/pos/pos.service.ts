import { Injectable, NotFoundException, BadRequestException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ValidateVoucherDto } from './dto/validate-voucher.dto';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class PosService {
  constructor(private prisma: PrismaService) {}

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

    // Update status to USED
    const updatedTx = await this.prisma.transaction.update({
      where: { id: tx.id },
      data: { status: 'USED' }
    });

    return {
      transactionId: updatedTx.id,
      voucherTitle: tx.voucher.title,
      value: tx.voucher.value,
      status: 'USED'
    };
  }

  async getMenus(cashierId: string) {
    const cashier = await this.prisma.user.findUnique({
      where: { id: cashierId }
    });

    if (!cashier || !cashier.managedRestoId) {
      throw new ForbiddenException('Akses ditolak: Kasir tidak terdaftar pada restoran manapun');
    }

    return this.prisma.menu.findMany({
      where: { restaurantId: cashier.managedRestoId, isAvailable: true }
    });
  }

  async createOrder(cashierId: string, dto: CreateOrderDto) {
    const cashier = await this.prisma.user.findUnique({
      where: { id: cashierId }
    });

    if (!cashier || !cashier.managedRestoId) {
      throw new ForbiddenException('Akses ditolak: Kasir tidak terdaftar pada restoran manapun');
    }

    const menuIds = dto.items.map(i => i.menuId);
    const menus = await this.prisma.menu.findMany({
      where: { id: { in: menuIds }, restaurantId: cashier.managedRestoId }
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

    // Discount implementation can be added here if needed.
    const discount = 0;
    const finalAmount = totalAmount - discount;

    const orderStatus = dto.paymentMethod === 'CASH' ? 'SETTLED' : 'PENDING';

    const order = await this.prisma.order.create({
      data: {
        restaurantId: cashier.managedRestoId,
        cashierId: cashier.id,
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
            "Content-Type": "application/json"
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
}
