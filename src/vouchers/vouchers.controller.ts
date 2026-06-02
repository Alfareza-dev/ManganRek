import { Controller, Get, Post, Put, Delete, Patch, Body, Param, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { BuyVoucherDto } from './dto/buy-voucher.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import type { Request } from 'express';

@Controller('api/vouchers')
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_RESTO)
  async create(@Req() req: Request, @Body() dto: CreateVoucherDto) {
    const user = req.user as any;
    const data = await this.vouchersService.create(user.userId, dto);
    return { success: true, message: 'Voucher berhasil dibuat', data };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_RESTO)
  async findAll(@Req() req: Request) {
    const user = req.user as any;
    const data = await this.vouchersService.findAll(user.userId);
    return { success: true, message: 'Daftar voucher', data };
  }

  @Get('public/all')
  async findAllPublic() {
    const data = await this.vouchersService.findAllPublic();
    return { success: true, message: 'Daftar semua voucher publik', data };
  }

  @Get('public/resto/:restoId')
  async findByRestoPublic(@Param('restoId') restoId: string) {
    const data = await this.vouchersService.findByRestoPublic(restoId);
    return { success: true, message: 'Daftar voucher restoran', data };
  }

  @Get('history/user')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  async getUserHistory(@Req() req: Request) {
    const user = req.user as any;
    const data = await this.vouchersService.getUserHistory(user.userId);
    return { success: true, message: 'Berhasil mengambil histori pembelian voucher', data };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_RESTO)
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as any;
    const data = await this.vouchersService.findOne(user.userId, id);
    return { success: true, message: 'Detail voucher berhasil dimuat', data };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_RESTO)
  async update(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdateVoucherDto) {
    const user = req.user as any;
    const data = await this.vouchersService.update(user.userId, id, dto);
    return { success: true, message: 'Voucher berhasil diperbarui', data };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_RESTO)
  async remove(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as any;
    await this.vouchersService.remove(user.userId, id);
    return { success: true, message: 'Voucher berhasil dihapus' };
  }

  @Post('buy')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.USER)
  async buyVoucher(@Req() req: Request, @Body() dto: BuyVoucherDto) {
    const user = req.user as any;
    const data = await this.vouchersService.buyVoucher(user.userId, dto);
    return { success: true, message: 'Transaksi berhasil dibuat', data };
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Body() payload: any) {
    return this.vouchersService.handleWebhook(payload);
  }

  @Patch('transactions/:id/verify-mock')
  async verifyMockTransaction(@Param('id') id: string) {
    const data = await this.vouchersService.verifyMockTransaction(id);
    return {
      success: true,
      message: 'Mock verifikasi sukses. Status transaksi menjadi PAID.',
      data
    };
  }
}
