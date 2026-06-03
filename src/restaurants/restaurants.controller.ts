import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { RestaurantsService } from './restaurants.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { CreatePromoDto } from './dto/create-promo.dto';
import { UpdatePromoDto } from './dto/update-promo.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import type { Request } from 'express';

@Controller('api/restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  // ==================== RESTAURANT PROFILE (ADMIN_RESTO) ====================

  @Get('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_RESTO)
  async getProfile(@Req() req: Request) {
    const user = req.user as any;
    const data = await this.restaurantsService.getProfile(user.userId);
    return { success: true, message: 'Profil restoran berhasil dimuat', data };
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_RESTO)
  async updateProfile(@Req() req: Request, @Body() dto: UpdateRestaurantDto) {
    const user = req.user as any;
    const data = await this.restaurantsService.updateProfile(user.userId, dto);
    return { success: true, message: 'Profil restoran berhasil diperbarui', data };
  }

  // ==================== FINANCE & ORDERS (ADMIN_RESTO) ====================

  @Get('revenue')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_RESTO)
  async getRevenue(@Req() req: Request) {
    const user = req.user as any;
    const data = await this.restaurantsService.getRevenue(user.userId);
    return { success: true, message: 'Ringkasan pendapatan restoran berhasil dimuat', data };
  }

  @Get('orders/history')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_RESTO)
  async getOrdersHistory(@Req() req: Request) {
    const user = req.user as any;
    const data = await this.restaurantsService.getOrdersHistory(user.userId);
    return { success: true, message: 'Riwayat transaksi berhasil dimuat', data };
  }

  // ==================== MENU CRUD (ADMIN_RESTO) ====================

  @Get('menus')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_RESTO)
  async getAllMenus(@Req() req: Request) {
    const user = req.user as any;
    const data = await this.restaurantsService.getAllMenus(user.userId);
    return { success: true, message: 'Daftar menu berhasil dimuat', data };
  }

  @Get('menus/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_RESTO)
  async getMenu(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as any;
    const data = await this.restaurantsService.getMenu(user.userId, id);
    return { success: true, message: 'Detail menu berhasil dimuat', data };
  }

  @Post('menus')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_RESTO)
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Tambah menu baru dengan upload gambar',
    type: CreateMenuDto,
  })
  async createMenu(
    @Req() req: Request,
    @Body() dto: CreateMenuDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Gambar menu wajib diunggah');
    }

    const user = req.user as any;
    const data = await this.restaurantsService.createMenu(user.userId, dto, file);
    return {
      success: true,
      message: 'Menu berhasil ditambahkan',
      data,
    };
  }

  @Put('menus/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_RESTO)
  async updateMenu(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateMenuDto,
  ) {
    const user = req.user as any;
    const data = await this.restaurantsService.updateMenu(
      user.userId,
      id,
      dto,
    );
    return {
      success: true,
      message: 'Menu berhasil diperbarui',
      data,
    };
  }

  @Delete('menus/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_RESTO)
  async deleteMenu(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as any;
    await this.restaurantsService.deleteMenu(user.userId, id);
    return {
      success: true,
      message: 'Menu berhasil dihapus',
    };
  }

  // ==================== PROMO CRUD (ADMIN_RESTO) ====================

  @Get('promos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_RESTO)
  async getAllPromos(@Req() req: Request) {
    const user = req.user as any;
    const data = await this.restaurantsService.getAllPromos(user.userId);
    return { success: true, message: 'Daftar promo berhasil dimuat', data };
  }

  @Get('promos/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_RESTO)
  async getPromo(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as any;
    const data = await this.restaurantsService.getPromo(user.userId, id);
    return { success: true, message: 'Detail promo berhasil dimuat', data };
  }

  @Post('promos')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_RESTO)
  async createPromo(@Req() req: Request, @Body() dto: CreatePromoDto) {
    const user = req.user as any;
    const data = await this.restaurantsService.createPromo(user.userId, dto);
    return {
      success: true,
      message: 'Promo berhasil ditambahkan',
      data,
    };
  }

  @Put('promos/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_RESTO)
  async updatePromo(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdatePromoDto,
  ) {
    const user = req.user as any;
    const data = await this.restaurantsService.updatePromo(
      user.userId,
      id,
      dto,
    );
    return {
      success: true,
      message: 'Promo berhasil diperbarui',
      data,
    };
  }

  @Delete('promos/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN_RESTO)
  async deletePromo(@Req() req: Request, @Param('id') id: string) {
    const user = req.user as any;
    await this.restaurantsService.deletePromo(user.userId, id);
    return {
      success: true,
      message: 'Promo berhasil dihapus',
    };
  }

  // ==================== PUBLIC DIRECTORY ====================

  @Get('all-menus')
  async getAllMenusPublic(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    const data = await this.restaurantsService.getAllMenusPublicWithPagination({
      page,
      limit,
      search,
    });
    return {
      success: true,
      message: 'Daftar semua menu berhasil dimuat',
      data,
    };
  }

  @Get('all-vouchers')
  async getAllVouchersPublic(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const data = await this.restaurantsService.getAllVouchersPublic({
      page,
      limit,
    });
    return {
      success: true,
      message: 'Daftar semua voucher berhasil dimuat',
      data,
    };
  }

  @Get('all-promos')
  async getAllPromosPublic(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const data = await this.restaurantsService.getAllPromosPublic({
      page,
      limit,
    });
    return {
      success: true,
      message: 'Daftar semua promo berhasil dimuat',
      data,
    };
  }

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('lat') lat?: string,
    @Query('lng') lng?: string,
    @Query('sort') sort?: string,
  ) {
    const data = await this.restaurantsService.findAllPublic({
      page,
      limit,
      lat,
      lng,
      sort,
    });
    return {
      success: true,
      message: 'Daftar restoran berhasil dimuat',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.restaurantsService.findOnePublic(id);
    return { success: true, message: 'Detail restoran berhasil dimuat', data };
  }

  @Get(':id/menus')
  async getMenus(@Param('id') id: string) {
    const data = await this.restaurantsService.getMenusPublic(id);
    return { success: true, message: 'Daftar menu berhasil dimuat', data };
  }

  @Get(':id/menus/:menuId')
  async getMenuDetail(@Param('id') id: string, @Param('menuId') menuId: string) {
    const data = await this.restaurantsService.getMenuDetailPublic(id, menuId);
    return { success: true, message: 'Detail menu berhasil dimuat', data };
  }

  @Get(':id/vouchers')
  async getVouchersPublic(@Param('id') id: string) {
    const data = await this.restaurantsService.getVouchersPublic(id);
    return { success: true, message: 'Daftar voucher restoran berhasil dimuat', data };
  }

  @Get(':id/vouchers/:voucherId')
  async getVoucherDetailPublic(@Param('id') id: string, @Param('voucherId') voucherId: string) {
    const data = await this.restaurantsService.getVoucherDetailPublic(id, voucherId);
    return { success: true, message: 'Detail voucher berhasil dimuat', data };
  }

  @Get(':id/promos')
  async getPromosPublic(@Param('id') id: string) {
    const data = await this.restaurantsService.getPromosPublic(id);
    return { success: true, message: 'Daftar promo restoran berhasil dimuat', data };
  }

  @Get(':id/promos/:promoId')
  async getPromoDetailPublic(@Param('id') id: string, @Param('promoId') promoId: string) {
    const data = await this.restaurantsService.getPromoDetailPublic(id, promoId);
    return { success: true, message: 'Detail promo berhasil dimuat', data };
  }
}
