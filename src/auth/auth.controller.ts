import { Controller, Post, Body, Res, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterRestoDto } from './dto/register-resto.dto';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/user')
  async registerUser(@Body() dto: RegisterUserDto) {
    const data = await this.authService.registerUser(dto);
    return {
      success: true,
      message: 'Registrasi user berhasil',
      data
    };
  }

  @Post('register/resto')
  async registerResto(@Body() dto: RegisterRestoDto) {
    const data = await this.authService.registerResto(dto);
    return {
      success: true,
      message: 'Registrasi multi-entity berhasil diajukan. Akun berstatus PENDING menunggu verifikasi administrator.',
      data
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { token, user } = await this.authService.login(dto);
    
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    });

    return {
      success: true,
      message: 'Login berhasil',
      data: user
    };
  }
}
