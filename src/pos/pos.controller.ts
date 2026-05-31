import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { PosService } from './pos.service';
import { ValidateVoucherDto } from './dto/validate-voucher.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import type { Request } from 'express';

@Controller('api/pos')
export class PosController {
  constructor(private readonly posService: PosService) {}

  @Post('validate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.KASIR)
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
}
