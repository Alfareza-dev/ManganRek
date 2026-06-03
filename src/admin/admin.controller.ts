import {
  Controller,
  Patch,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Query,
  Delete,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { UpdateApprovalDto } from './dto/update-approval.dto';
import { UpdateConfigDto } from './dto/system-config.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('api/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Config and revenue endpoints removed. Admin Resto gets 100% of revenue now.
  @Get('payments')
  async getAllPayments(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const data = await this.adminService.getAllPayments(Number(page), Number(limit));
    return { success: true, message: 'Berhasil mengambil histori pembayaran', data };
  }

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

  @Get('users')
  async getUsers(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const data = await this.adminService.getUsers(Number(page), Number(limit));
    return { success: true, message: 'Berhasil mengambil data user', data };
  }

  @Get('owners')
  async getOwners(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const data = await this.adminService.getOwners(Number(page), Number(limit));
    return { success: true, message: 'Berhasil mengambil data owner', data };
  }

  @Get('users/:id')
  async getUserById(@Param('id') id: string) {
    const data = await this.adminService.getUserById(id);
    return { success: true, message: 'Berhasil mengambil detail user', data };
  }

  @Get('owners/:id')
  async getOwnerById(@Param('id') id: string) {
    const data = await this.adminService.getOwnerById(id);
    return { success: true, message: 'Berhasil mengambil detail owner', data };
  }

  @Patch('users/:id/ban')
  async toggleBanUser(@Param('id') id: string) {
    const data = await this.adminService.toggleBanUser(id);
    return {
      success: true,
      message: `Status akun berhasil diubah menjadi ${data.status}`,
      data,
    };
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    const data = await this.adminService.deleteUser(id);
    return { success: true, message: data.message };
  }

  @Patch('owners/:id/ban')
  async toggleBanOwner(@Param('id') id: string) {
    const data = await this.adminService.toggleBanUser(id);
    return {
      success: true,
      message: `Status akun owner berhasil diubah menjadi ${data.status}`,
      data,
    };
  }

  @Delete('owners/:id')
  async deleteOwner(@Param('id') id: string) {
    const data = await this.adminService.deleteUser(id);
    return { success: true, message: data.message };
  }
}
