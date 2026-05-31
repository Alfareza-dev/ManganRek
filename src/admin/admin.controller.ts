import {
  Controller,
  Patch,
  Get,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateApprovalDto } from './dto/update-approval.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('api/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('approvals')
  async getPendingApprovals() {
    const data = await this.adminService.getPendingApprovals();
    return {
      success: true,
      message: 'Daftar akun ADMIN_RESTO menunggu persetujuan',
      data,
    };
  }

  @Patch('approvals/:id')
  async updateApproval(
    @Param('id') id: string,
    @Body() dto: UpdateApprovalDto,
  ) {
    const data = await this.adminService.updateApproval(id, dto);
    return {
      success: true,
      message: `Status akun berhasil diubah menjadi ${dto.status}`,
      data,
    };
  }
}
