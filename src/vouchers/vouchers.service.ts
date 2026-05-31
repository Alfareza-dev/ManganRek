import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
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
        expiryDate: new Date(dto.expiryDate),
        restaurantId: resto.id
      }
    });
  }

  async findAll(adminId: string) {
    const resto = await this.getAdminResto(adminId);
    return this.prisma.voucher.findMany({
      where: { restaurantId: resto.id }
    });
  }

  async findOne(adminId: string, id: string) {
    const resto = await this.getAdminResto(adminId);
    const voucher = await this.prisma.voucher.findFirst({
      where: { id, restaurantId: resto.id }
    });
    if (!voucher) throw new NotFoundException('Voucher tidak ditemukan');
    return voucher;
  }

  async update(adminId: string, id: string, dto: UpdateVoucherDto) {
    const resto = await this.getAdminResto(adminId);
    const voucher = await this.prisma.voucher.findFirst({
      where: { id, restaurantId: resto.id }
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
      where: { id, restaurantId: resto.id }
    });
    if (!voucher) throw new NotFoundException('Voucher tidak ditemukan');

    return this.prisma.voucher.delete({
      where: { id }
    });
  }

  async buyVoucher(userId: string, dto: BuyVoucherDto) {
    const voucher = await this.prisma.voucher.findUnique({
      where: { id: dto.voucherId }
    });
    if (!voucher) throw new NotFoundException('Voucher tidak ditemukan');
    if (voucher.expiryDate < new Date()) {
      throw new BadRequestException('Voucher sudah kadaluarsa');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    
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
}
