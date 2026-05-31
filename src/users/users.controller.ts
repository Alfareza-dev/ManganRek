import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateCashierDto } from './dto/create-cashier.dto';
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
}
