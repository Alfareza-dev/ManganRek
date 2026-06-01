import {
  Controller, Post, Get, Put, Body, Res, HttpCode, HttpStatus,
  UseGuards, Req, UseInterceptors, UploadedFile, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterRestoDto } from './dto/register-resto.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { Response, Request } from 'express';

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
  @UseInterceptors(FileInterceptor('legalPhoto'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Registrasi restoran baru dengan upload berkas legalitas',
    type: RegisterRestoDto,
  })
  async registerResto(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Berkas legalPhoto wajib disertakan');
    }

    const dto = req.body as RegisterRestoDto;
    const data = await this.authService.registerResto(dto, file);
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
      data: user,
      token: token
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0
    });

    return {
      success: true,
      message: 'Logout berhasil'
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: any) {
    const data = await this.authService.getProfile(req.user.userId);
    return {
      success: true,
      message: 'Berhasil mengambil profil',
      data
    };
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Req() req: any, @Body() dto: UpdateProfileDto) {
    const data = await this.authService.updateProfile(req.user.userId, dto);
    return {
      success: true,
      message: 'Profil berhasil diperbarui',
      data
    };
  }

  @Put('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(@Req() req: any, @Body() dto: ChangePasswordDto) {
    const data = await this.authService.changePassword(req.user.userId, dto);
    return {
      success: true,
      message: data.message
    };
  }
}
