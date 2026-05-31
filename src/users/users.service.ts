import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateCashierDto } from './dto/create-cashier.dto';

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
}
