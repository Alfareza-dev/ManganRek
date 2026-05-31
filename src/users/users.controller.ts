import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateCashierDto } from './dto/create-cashier.dto';
import { UpdateCashierDto } from './dto/update-cashier.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import type { Request } from 'express';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('cashier')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_RESTO)
  async createCashier(@Req() req: Request, @Body() dto: CreateCashierDto) {
    const user = req.user as any;
    const data = await this.usersService.createCashier(user.userId, dto);
    
    return {
      success: true,
      message: 'Akun kasir berhasil dibuat',
      data
    };
  }

  @Get('cashiers')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_RESTO)
  async getCashiers(@Req() req: Request) {
    const user = req.user as any;
    const data = await this.usersService.getCashiers(user.userId);
    return { success: true, message: 'Berhasil mengambil daftar kasir', data };
  }

  @Get('cashiers/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_RESTO)
  async getCashierById(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as any;
    const data = await this.usersService.getCashierById(user.userId, id);
    return { success: true, message: 'Berhasil mengambil detail kasir', data };
  }

  @Put('cashiers/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_RESTO)
  async updateCashier(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdateCashierDto) {
    const user = req.user as any;
    const data = await this.usersService.updateCashier(user.userId, id, dto);
    return { success: true, message: 'Data kasir berhasil diperbarui', data };
  }

  @Delete('cashiers/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_RESTO)
  async deleteCashier(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as any;
    const data = await this.usersService.deleteCashier(user.userId, id);
    return { success: true, message: data.message };
  }
}
