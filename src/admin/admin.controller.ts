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

  @Post('config')
  async updateConfig(@Body() dto: UpdateConfigDto) {
    const data = await this.adminService.upsertConfig(dto.key, dto.value);
    return { success: true, message: 'Konfigurasi berhasil disimpan', data };
  }

  @Get('config')
  async getConfig(@Query('key') key: string) {
    const targetKey = key || 'VOUCHER_FEE_PERCENTAGE';
    const value = await this.adminService.getConfig(targetKey);
    return { success: true, message: 'Konfigurasi berhasil diambil', data: { key: targetKey, value } };
  }

  @Get('revenue')
  async getRevenue() {
    const totalPlatformFee = await this.adminService.getPlatformRevenue();
    return { success: true, message: 'Total pendapatan platform', data: { totalPlatformFee } };
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
}
