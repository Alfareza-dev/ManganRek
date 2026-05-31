import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ValidateVoucherDto } from './dto/validate-voucher.dto';

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
}
