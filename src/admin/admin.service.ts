import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AccountStatus, Role } from '@prisma/client';
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
}
