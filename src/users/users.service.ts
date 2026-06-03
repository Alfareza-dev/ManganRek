import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateCashierDto } from './dto/create-cashier.dto';
import { UpdateCashierDto } from './dto/update-cashier.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async createCashier(adminId: string, dto: CreateCashierDto) {
    const adminResto = await this.prisma.restaurant.findUnique({
      where: { ownerId: adminId },
    });

    if (!adminResto) {
      throw new NotFoundException('Restoran tidak ditemukan untuk admin ini');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    try {
      const cashier = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          name: dto.name,
          role: 'KASIR',
          status: 'ACTIVE',
          managedRestoId: adminResto.id,
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = cashier;
      return result;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Email sudah digunakan');
      }
      throw error;
    }
  }

  async getCashiers(adminId: string) {
    const adminResto = await this.prisma.restaurant.findUnique({
      where: { ownerId: adminId },
    });
    if (!adminResto) throw new NotFoundException('Restoran tidak ditemukan');

    return this.prisma.user.findMany({
      where: { managedRestoId: adminResto.id, role: 'KASIR' },
      select: { id: true, email: true, name: true, status: true, createdAt: true },
    });
  }

  async getCashierById(adminId: string, cashierId: string) {
    const adminResto = await this.prisma.restaurant.findUnique({
      where: { ownerId: adminId },
    });
    if (!adminResto) throw new NotFoundException('Restoran tidak ditemukan');

    const cashier = await this.prisma.user.findFirst({
      where: { id: cashierId, managedRestoId: adminResto.id, role: 'KASIR' },
      select: { id: true, email: true, name: true, status: true, createdAt: true },
    });

    if (!cashier) throw new NotFoundException('Kasir tidak ditemukan');
    return cashier;
  }

  async updateCashier(adminId: string, cashierId: string, dto: UpdateCashierDto) {
    const adminResto = await this.prisma.restaurant.findUnique({
      where: { ownerId: adminId },
    });
    if (!adminResto) throw new NotFoundException('Restoran tidak ditemukan');

    const cashier = await this.prisma.user.findFirst({
      where: { id: cashierId, managedRestoId: adminResto.id, role: 'KASIR' },
    });
    if (!cashier) throw new NotFoundException('Kasir tidak ditemukan');

    const data: any = {};
    if (dto.name) data.name = dto.name;
    if (dto.email) data.email = dto.email;
    if (dto.password) data.password = await bcrypt.hash(dto.password, 10);

    try {
      return await this.prisma.user.update({
        where: { id: cashierId },
        data,
        select: { id: true, email: true, name: true, status: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Email sudah digunakan');
      }
      throw error;
    }
  }

  async updateCashierPassword(adminId: string, cashierId: string, newPassword: string) {
    const adminResto = await this.prisma.restaurant.findUnique({
      where: { ownerId: adminId },
    });
    if (!adminResto) throw new NotFoundException('Restoran tidak ditemukan');

    const cashier = await this.prisma.user.findFirst({
      where: { id: cashierId, managedRestoId: adminResto.id, role: 'KASIR' },
    });
    if (!cashier) throw new NotFoundException('Kasir tidak ditemukan');

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: cashierId },
      data: { password: hashedPassword },
    });

    return { message: 'Password kasir berhasil diubah' };
  }

  async deleteCashier(adminId: string, cashierId: string) {
    const adminResto = await this.prisma.restaurant.findUnique({
      where: { ownerId: adminId },
    });
    if (!adminResto) throw new NotFoundException('Restoran tidak ditemukan');

    const cashier = await this.prisma.user.findFirst({
      where: { id: cashierId, managedRestoId: adminResto.id, role: 'KASIR' },
    });
    if (!cashier) throw new NotFoundException('Kasir tidak ditemukan');

    try {
      await this.prisma.user.delete({ where: { id: cashierId } });
      return { message: 'Kasir berhasil dihapus' };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        throw new BadRequestException('Kasir tidak dapat dihapus karena sudah memiliki riwayat pesanan (order).');
      }
      throw error;
    }
  }
}
