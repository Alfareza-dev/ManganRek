import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AccountStatus, Role, Prisma } from '@prisma/client';
import { UpdateApprovalDto } from './dto/update-approval.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async updateApproval(userId: string, dto: UpdateApprovalDto) {
    // Validate that the target status is either ACTIVE or REJECTED
    if (
      dto.status !== AccountStatus.ACTIVE &&
      dto.status !== AccountStatus.REJECTED
    ) {
      throw new BadRequestException(
        'Status hanya boleh ACTIVE atau REJECTED',
      );
    }

    // Find the user
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    // Validate role is ADMIN_RESTO
    if (user.role !== Role.ADMIN_RESTO) {
      throw new BadRequestException(
        'Hanya akun ADMIN_RESTO yang dapat di-approve/reject',
      );
    }

    // Validate current status is PENDING
    if (user.status !== AccountStatus.PENDING) {
      throw new BadRequestException(
        `Akun sudah diproses sebelumnya (status saat ini: ${user.status})`,
      );
    }

    // Update the status
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { status: dto.status },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }

  async getPendingApprovals() {
    return this.prisma.user.findMany({
      where: {
        role: Role.ADMIN_RESTO,
        status: AccountStatus.PENDING,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
        restaurant: {
          select: {
            id: true,
            name: true,
            address: true,
            legalPhoto: true,
          },
        },
      },
    });
  }

  async getUsers(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where: { role: { in: [Role.USER, Role.KASIR] }, isDeleted: false },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where: { role: { in: [Role.USER, Role.KASIR] }, isDeleted: false } }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getOwners(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where: { role: Role.ADMIN_RESTO, isDeleted: false },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { restaurant: true },
      }),
      this.prisma.user.count({ where: { role: Role.ADMIN_RESTO, isDeleted: false } }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        restaurant: true,
        managedResto: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async getOwnerById(id: string) {
    const owner = await this.prisma.user.findFirst({
      where: { id, role: Role.ADMIN_RESTO },
      include: { restaurant: true },
    });
    if (!owner) throw new NotFoundException('Owner not found');
    return owner;
  }

  async toggleBanUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const newStatus = user.status === AccountStatus.REJECTED ? AccountStatus.ACTIVE : AccountStatus.REJECTED;

    return this.prisma.user.update({
      where: { id },
      data: { status: newStatus },
      select: { id: true, email: true, status: true },
    });
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    // Soft delete to preserve history (orders, transactions)
    await this.prisma.user.update({
      where: { id },
      data: { isDeleted: true }
    });

    return { message: 'User berhasil dihapus' };
  }

  async upsertConfig(key: string, value: string) {
    return this.prisma.systemConfig.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  async getConfig(key: string) {
    const config = await this.prisma.systemConfig.findUnique({
      where: { key },
    });
    return config ? config.value : null;
  }

  // Removed getPlatformRevenue as Admin Web no longer takes a cut

  async getAllPayments(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [transactions, totalTransactions, orders, totalOrders] = await Promise.all([
      this.prisma.transaction.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { 
          user: { select: { name: true, email: true } },
          voucher: { select: { title: true, restaurant: { select: { name: true } } } }
        }
      }),
      this.prisma.transaction.count(),
      this.prisma.order.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { 
          restaurant: { select: { name: true } }, 
          cashier: { select: { name: true } } 
        }
      }),
      this.prisma.order.count(),
    ]);

    return {
      transactions: {
        data: transactions,
        total: totalTransactions,
        page,
        limit,
        totalPages: Math.ceil(totalTransactions / limit)
      },
      orders: {
        data: orders,
        total: totalOrders,
        page,
        limit,
        totalPages: Math.ceil(totalOrders / limit)
      }
    };
  }
}

