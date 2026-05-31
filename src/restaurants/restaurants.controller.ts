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
  Req,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { CreatePromoDto } from './dto/create-promo.dto';
import { UpdatePromoDto } from './dto/update-promo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import type { Request } from 'express';

@Controller('api/restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  // ==================== PUBLIC DIRECTORY ====================

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

  // ==================== MENU CRUD (ADMIN_RESTO) ====================

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
  async createMenu(@Req() req: Request, @Body() dto: CreateMenuDto) {
    const user = req.user as any;
    const data = await this.restaurantsService.createMenu(user.userId, dto);
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
}
