import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { BuyVoucherDto } from './dto/buy-voucher.dto';

@Injectable()
export class VouchersService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService
  ) {}

  private async getAdminResto(adminId: string) {
    const resto = await this.prisma.restaurant.findUnique({
      where: { ownerId: adminId }
    });
    if (!resto) throw new NotFoundException('Restoran tidak ditemukan');
    return resto;
  }

  async create(adminId: string, dto: CreateVoucherDto) {
    const resto = await this.getAdminResto(adminId);
    return this.prisma.voucher.create({
      data: {
        title: dto.title,
        price: dto.price,
        value: dto.value,
        stock: dto.stock,
        expiryDate: new Date(dto.expiryDate),
        restaurantId: resto.id
      }
    });
  }

  async findAll(adminId: string) {
    const resto = await this.getAdminResto(adminId);
    return this.prisma.voucher.findMany({
      where: { restaurantId: resto.id, isDeleted: false }
    });
  }

  async findOne(adminId: string, id: string) {
    const resto = await this.getAdminResto(adminId);
    const voucher = await this.prisma.voucher.findFirst({
      where: { id, restaurantId: resto.id, isDeleted: false }
    });
    if (!voucher) throw new NotFoundException('Voucher tidak ditemukan');
    return voucher;
  }

  async update(adminId: string, id: string, dto: UpdateVoucherDto) {
    const resto = await this.getAdminResto(adminId);
    const voucher = await this.prisma.voucher.findFirst({
      where: { id, restaurantId: resto.id, isDeleted: false }
    });
    if (!voucher) throw new NotFoundException('Voucher tidak ditemukan');

    const dataToUpdate: any = { ...dto };
    if (dto.expiryDate) {
      dataToUpdate.expiryDate = new Date(dto.expiryDate);
    }

    return this.prisma.voucher.update({
      where: { id },
      data: dataToUpdate
    });
  }

  async remove(adminId: string, id: string) {
    const resto = await this.getAdminResto(adminId);
    const voucher = await this.prisma.voucher.findFirst({
      where: { id, restaurantId: resto.id, isDeleted: false }
    });
    if (!voucher) throw new NotFoundException('Voucher tidak ditemukan');

    try {
      // Soft delete
      return await this.prisma.voucher.update({
        where: { id },
        data: { isDeleted: true }
      });
    } catch (error) {
      throw error;
    }
  }

  async buyVoucher(userId: string, dto: BuyVoucherDto) {
    const voucher = await this.prisma.voucher.findUnique({
      where: { id: dto.voucherId }
    });
    if (!voucher || voucher.isDeleted) throw new NotFoundException('Voucher tidak ditemukan');
    if (voucher.expiryDate < new Date()) {
      throw new BadRequestException('Voucher sudah kadaluarsa');
    }
    if (voucher.stock <= 0) {
      throw new BadRequestException('Stok voucher habis');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    
    // Decrement stock
    await this.prisma.voucher.update({
      where: { id: voucher.id },
      data: { stock: { decrement: 1 } }
    });

    const transaction = await this.prisma.transaction.create({
      data: {
        userId,
        voucherId: voucher.id,
        status: 'PENDING',
        totalPaid: voucher.price
      }
    });

    const apiKey = this.configService.get<string>('LOUVIN_API_KEY');
    if (!apiKey) throw new InternalServerErrorException('Konfigurasi Payment Gateway belum diatur');

    try {
      const res = await fetch("https://api.louvin.dev/create-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey
        },
        body: JSON.stringify({
          amount: voucher.price,
          payment_type: "qris",
          customer_name: user?.name || "Customer",
          reference: transaction.id
        })
      });

      const louvinData = await res.json();
      if (!res.ok || !louvinData.success) {
        throw new Error(louvinData.error || 'Gagal membuat transaksi di Louvin');
      }

      const updatedTx = await this.prisma.transaction.update({
        where: { id: transaction.id },
        data: { paymentUrl: louvinData.payment.qr_string }
      });

      return updatedTx;
    } catch (err: any) {
      // Rollback transaction if payment creation failed
      await this.prisma.transaction.delete({ where: { id: transaction.id } });
      // Rollback stock
      await this.prisma.voucher.update({
        where: { id: voucher.id },
        data: { stock: { increment: 1 } }
      });
      throw new InternalServerErrorException(err.message);
    }
  }

  private generateUniqueCode(length: number = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async handleWebhook(payload: any) {
    if (payload.event === 'payment.settled') {
      const reference = payload.data?.reference || payload.data?.order_id;
      if (!reference) return { received: true };

      const tx = await this.prisma.transaction.findUnique({
        where: { id: reference }
      });

      if (tx && tx.status === 'PENDING') {
        const uniqueCode = this.generateUniqueCode(8);
        await this.prisma.transaction.update({
          where: { id: tx.id },
          data: {
            status: 'PAID',
            uniqueCode: uniqueCode
          }
        });
      }
    }
    return { received: true };
  }

  async verifyMockTransaction(transactionId: string) {
    const tx = await this.prisma.transaction.findUnique({
      where: { id: transactionId }
    });

    if (!tx) throw new NotFoundException('Transaksi tidak ditemukan');
    if (tx.status !== 'PENDING') throw new BadRequestException('Transaksi tidak dalam status PENDING');

    // Generate unique code
    const uniqueCode = this.generateUniqueCode(8);

    // Get config fee
    // No platform fee anymore. Admin Resto gets 100%.
    const platformFee = 0;

    return this.prisma.transaction.update({
      where: { id: tx.id },
      data: {
        status: 'PAID',
        uniqueCode,
        platformFee
      }
    });
  }


  async findAllPublic() {
    return this.prisma.voucher.findMany({
      where: { isDeleted: false },
      include: {
        restaurant: {
          select: { name: true, address: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findByRestoPublic(restoId: string) {
    return this.prisma.voucher.findMany({
      where: { restaurantId: restoId, isDeleted: false },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getUserHistory(userId: string) {
    return this.prisma.transaction.findMany({
      where: { userId },
      include: {
        voucher: {
          include: {
            restaurant: {
              select: { name: true, address: true, legalPhoto: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}

