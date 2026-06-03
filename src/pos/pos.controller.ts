import { Controller, Post, Get, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { PosService } from './pos.service';
import { ValidateVoucherDto } from './dto/validate-voucher.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import type { Request } from 'express';

@ApiTags('POS Kasir')
@ApiBearerAuth()
@Controller('api/pos')
export class PosController {
  constructor(private readonly posService: PosService) {}

  @Post('validate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.KASIR)
  @ApiOperation({ summary: 'Validasi Voucher (Cek status dan potongan harga)' })
  async validateVoucher(@Req() req: Request, @Body() dto: ValidateVoucherDto) {
    const user = req.user as any;
    
    // We need to fetch the KASIR's managedRestoId. 
    // Since it's not currently in the JWT payload, we either fetch from db, 
    // or assume it's added to the payload. Wait, `auth.service.ts` needs to include `managedRestoId` in JWT,
    // or we fetch it here. Let's fetch the KASIR details from Prisma first if not present in JWT.
    // However, to keep PosController simple, we should fetch it in the service or here.
    // Let's pass the user ID to the service, and the service will find the managedRestoId.
    const data = await this.posService.validateVoucher(user.userId, dto);
    
    return {
      success: true,
      message: `Voucher valid! Potongan belanja sebesar ${data.value} berhasil digunakan.`,
      data
    };
  }

  @Post('orders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.KASIR)
  @ApiOperation({ summary: 'Buat Order POS Kasir' })
  async createOrder(@Req() req: Request, @Body() dto: CreateOrderDto) {
    const user = req.user as any;
    const data = await this.posService.createOrder(user.userId, dto);
    return data;
  }

  @Get('menus')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.KASIR)
  @ApiOperation({ summary: 'Ambil daftar menu restoran Kasir (termasuk diskon)' })
  async getMenus(@Req() req: Request) {
    const user = req.user as any;
    const data = await this.posService.getMenus(user.userId);
    return {
      success: true,
      message: 'Daftar menu berhasil dimuat',
      data
    };
  }

  @Get('orders/history')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.KASIR)
  @ApiOperation({ summary: 'Ambil riwayat order kasir' })
  async getOrderHistory(@Req() req: Request) {
    const user = req.user as any;
    const data = await this.posService.getOrderHistory(user.userId);
    return {
      success: true,
      message: 'Riwayat order kasir berhasil diambil',
      data
    };
  }

  @Patch('orders/:id/cancel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.KASIR)
  @ApiOperation({ summary: 'Batalkan order kasir yang PENDING' })
  async cancelOrder(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as any;
    const data = await this.posService.cancelOrder(user.userId, id);
    return {
      success: true,
      message: 'Order berhasil dibatalkan',
      data
    };
  }

  @Patch('orders/:id/verify-mock')
  @ApiOperation({ summary: 'Mock verifikasi order QRIS (Ubah PENDING menjadi SETTLED)' })
  async verifyMockOrder(@Param('id') id: string) {
    const data = await this.posService.verifyMockOrder(id);
    return {
      success: true,
      message: 'Mock verifikasi sukses. Status order menjadi SETTLED.',
      data
    };
  }
}
