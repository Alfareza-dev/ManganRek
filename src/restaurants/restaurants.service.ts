import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { CreatePromoDto } from './dto/create-promo.dto';
import { UpdatePromoDto } from './dto/update-promo.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RestaurantsService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  // ==================== HELPER ====================

  /**
   * Cari restoran milik user yang sedang login.
   * Throw NotFoundException jika user belum punya restoran.
   */
  private async getOwnedRestaurant(userId: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { ownerId: userId },
    });
    if (!restaurant) {
      throw new NotFoundException('Restoran tidak ditemukan untuk akun ini');
    }
    return restaurant;
  }

  // ==================== RESTAURANT PROFILE ====================

  async getProfile(userId: string) {
    return this.getOwnedRestaurant(userId);
  }

  async updateProfile(userId: string, dto: UpdateRestaurantDto) {
    const restaurant = await this.getOwnedRestaurant(userId);
    
    return this.prisma.restaurant.update({
      where: { id: restaurant.id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.address !== undefined && { address: dto.address }),
        ...(dto.category !== undefined && { category: dto.category }),
        ...(dto.openingHours !== undefined && { openingHours: dto.openingHours }),
        ...(dto.branches !== undefined && { branches: dto.branches }),
        ...(dto.googleMapsUrl !== undefined && { googleMapsUrl: dto.googleMapsUrl }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.isOpen !== undefined && { isOpen: dto.isOpen }),
      },
    });
  }

  // ==================== FINANCE & ORDERS ====================

  async getRevenue(userId: string) {
    const restaurant = await this.getOwnedRestaurant(userId);
    
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Total Orders Revenue
    const ordersAgg = await this.prisma.order.aggregate({
      where: { restaurantId: restaurant.id, status: 'SETTLED' },
      _sum: { finalAmount: true },
    });
    const totalOrderRevenue = ordersAgg._sum.finalAmount || 0;

    // Daily Orders Revenue
    const dailyOrdersAgg = await this.prisma.order.aggregate({
      where: { restaurantId: restaurant.id, status: 'SETTLED', createdAt: { gte: startOfToday } },
      _sum: { finalAmount: true },
    });
    const dailyOrderRevenue = dailyOrdersAgg._sum.finalAmount || 0;

    // Total Transactions
    const orderCount = await this.prisma.order.count({
      where: { restaurantId: restaurant.id, status: 'SETTLED' },
    });

    // Total Vouchers Revenue
    const vouchersAgg = await this.prisma.transaction.findMany({
      where: { 
        voucher: { restaurantId: restaurant.id },
        status: 'PAID'
      }
    });
    const totalVoucherRevenue = vouchersAgg.reduce((sum, tx) => sum + tx.totalPaid, 0);

    // Daily Vouchers Revenue
    const dailyVouchersAgg = await this.prisma.transaction.findMany({
      where: { 
        voucher: { restaurantId: restaurant.id },
        status: 'PAID',
        createdAt: { gte: startOfToday }
      }
    });
    const dailyVoucherRevenue = dailyVouchersAgg.reduce((sum, tx) => sum + tx.totalPaid, 0);

    // Total Voucher Transactions count
    const voucherTxCount = vouchersAgg.length;

    return {
      totalOrderRevenue,
      totalVoucherRevenue,
      totalRevenue: totalOrderRevenue + totalVoucherRevenue,
      totalDaily: dailyOrderRevenue + dailyVoucherRevenue,
      totalTransactions: orderCount + voucherTxCount
    };
  }

  async getOrdersHistory(userId: string) {
    const restaurant = await this.getOwnedRestaurant(userId);
    
    const orders = await this.prisma.order.findMany({
      where: { restaurantId: restaurant.id },
      orderBy: { createdAt: 'desc' },
      include: { items: { include: { menu: { select: { name: true } } } }, cashier: { select: { name: true } } }
    });

    const vouchers = await this.prisma.transaction.findMany({
      where: { voucher: { restaurantId: restaurant.id } },
      orderBy: { createdAt: 'desc' },
      include: { voucher: true, user: { select: { name: true } } }
    });

    return { orders, vouchers };
  }

  // ==================== MENU CRUD ====================

  async getAllMenus(userId: string) {
    const restaurant = await this.getOwnedRestaurant(userId);
    const menus = await this.prisma.menu.findMany({
      where: { restaurantId: restaurant.id, isDeleted: false },
      orderBy: { createdAt: 'desc' }
    });
    return this.applyPromosToMenus(menus);
  }

  async createMenu(userId: string, dto: CreateMenuDto, file: Express.Multer.File) {
    const restaurant = await this.getOwnedRestaurant(userId);

    // Upload image to Cloudinary
    const uploadResult = await this.cloudinaryService.uploadFile(file, 'mangan-rek/menus');

    return this.prisma.menu.create({
      data: {
        restaurantId: restaurant.id,
        name: dto.name,
        description: dto.description,
        price: Number(dto.price),
        image: uploadResult.secure_url,
        isAvailable: dto.isAvailable !== undefined ? (String(dto.isAvailable) === 'true' || dto.isAvailable === true) : true,
      },
    });
  }

  async getMenu(userId: string, menuId: string) {
    const restaurant = await this.getOwnedRestaurant(userId);
    const menu = await this.prisma.menu.findUnique({
      where: { id: menuId },
    });
    if (!menu || menu.isDeleted) throw new NotFoundException('Menu tidak ditemukan');
    if (menu.restaurantId !== restaurant.id) throw new ForbiddenException('Akses ditolak');
    const [enriched] = await this.applyPromosToMenus([menu]);
    return enriched;
  }

  async updateMenu(userId: string, menuId: string, dto: UpdateMenuDto, file?: Express.Multer.File) {
    const restaurant = await this.getOwnedRestaurant(userId);

    // Cek apakah menu ini milik restoran user
    const menu = await this.prisma.menu.findUnique({
      where: { id: menuId },
    });
    if (!menu || menu.isDeleted) {
      throw new NotFoundException('Menu tidak ditemukan');
    }
    if (menu.restaurantId !== restaurant.id) {
      throw new ForbiddenException('Anda tidak memiliki akses ke menu ini');
    }

    let imageUrl = menu.image;
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadFile(file, 'mangan-rek/menus');
      imageUrl = uploadResult.secure_url;
    }

    return this.prisma.menu.update({
      where: { id: menuId },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.price !== undefined && { price: Number(dto.price) }),
        ...(dto.isAvailable !== undefined && { isAvailable: String(dto.isAvailable) === 'true' || dto.isAvailable === true }),
        image: imageUrl,
      },
    });
  }

  async deleteMenu(userId: string, menuId: string) {
    const restaurant = await this.getOwnedRestaurant(userId);

    const menu = await this.prisma.menu.findUnique({
      where: { id: menuId },
    });
    if (!menu || menu.isDeleted) {
      throw new NotFoundException('Menu tidak ditemukan');
    }
    if (menu.restaurantId !== restaurant.id) {
      throw new ForbiddenException('Anda tidak memiliki akses ke menu ini');
    }

    await this.prisma.menu.update({ 
      where: { id: menuId },
      data: { isDeleted: true }
    });
    return { deleted: true };
  }

  // ==================== PROMO CRUD ====================

  async getAllPromos(userId: string) {
    const restaurant = await this.getOwnedRestaurant(userId);
    return this.prisma.promo.findMany({
      where: { restaurantId: restaurant.id },
      include: { menus: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createPromo(userId: string, dto: CreatePromoDto) {
    const restaurant = await this.getOwnedRestaurant(userId);
    const data: any = {
      restaurantId: restaurant.id,
      discount: dto.discount,
      startHour: dto.startHour,
      endHour: dto.endHour,
      type: dto.type || 'ALL',
    };

    if (dto.type === 'SPECIFIC' && dto.menuIds && dto.menuIds.length > 0) {
      data.menus = {
        connect: dto.menuIds.map((id) => ({ id })),
      };
    }

    return this.prisma.promo.create({
      data,
      include: { menus: { select: { id: true, name: true } } },
    });
  }

  async getPromo(userId: string, promoId: string) {
    const restaurant = await this.getOwnedRestaurant(userId);
    const promo = await this.prisma.promo.findUnique({
      where: { id: promoId },
      include: { menus: { select: { id: true, name: true } } },
    });
    if (!promo) throw new NotFoundException('Promo tidak ditemukan');
    if (promo.restaurantId !== restaurant.id) throw new ForbiddenException('Akses ditolak');
    return promo;
  }

  async updatePromo(userId: string, promoId: string, dto: UpdatePromoDto) {
    const restaurant = await this.getOwnedRestaurant(userId);

    const promo = await this.prisma.promo.findUnique({
      where: { id: promoId },
    });
    if (!promo) {
      throw new NotFoundException('Promo tidak ditemukan');
    }
    if (promo.restaurantId !== restaurant.id) {
      throw new ForbiddenException('Anda tidak memiliki akses ke promo ini');
    }

    const data: any = {
      ...(dto.discount !== undefined && { discount: dto.discount }),
      ...(dto.startHour !== undefined && { startHour: dto.startHour }),
      ...(dto.endHour !== undefined && { endHour: dto.endHour }),
      ...(dto.type !== undefined && { type: dto.type }),
    };

    const finalType = dto.type || promo.type;

    if (finalType === 'SPECIFIC') {
      if (dto.menuIds !== undefined) {
        data.menus = { set: dto.menuIds.map((id) => ({ id })) };
      }
    } else if (finalType === 'ALL') {
      data.menus = { set: [] };
    }

    return this.prisma.promo.update({
      where: { id: promoId },
      data,
      include: { menus: { select: { id: true, name: true } } },
    });
  }

  async deletePromo(userId: string, promoId: string) {
    const restaurant = await this.getOwnedRestaurant(userId);

    const promo = await this.prisma.promo.findUnique({
      where: { id: promoId },
    });
    if (!promo) {
      throw new NotFoundException('Promo tidak ditemukan');
    }
    if (promo.restaurantId !== restaurant.id) {
      throw new ForbiddenException('Anda tidak memiliki akses ke promo ini');
    }

    await this.prisma.promo.delete({ where: { id: promoId } });
    return { deleted: true };
  }

  // ==================== DIREKTORI PUBLIK ====================

  async findAllPublic(query: {
    page?: string;
    limit?: string;
    search?: string;
    lat?: string;
    lng?: string;
    sort?: string;
  }) {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '10', 10);
    const offset = (page - 1) * limit;

    const hasCoordinates = query.lat && query.lng;

    let restaurants: any[];
    let total: number;

    if (hasCoordinates) {
      const lat = parseFloat(query.lat!);
      const lng = parseFloat(query.lng!);
      const sortOrder = query.sort === 'terjauh' ? 'DESC' : 'ASC';

      let searchFilter = Prisma.empty;
      if (query.search) {
        const searchPattern = `%${query.search}%`;
        searchFilter = Prisma.sql`
          AND (
            r.name ILIKE ${searchPattern} OR
            r.address ILIKE ${searchPattern} OR
            r.category ILIKE ${searchPattern} OR
            r.description ILIKE ${searchPattern} OR
            EXISTS (
              SELECT 1 FROM menus m
              WHERE m."restaurantId" = r.id
                AND m.name ILIKE ${searchPattern}
                AND m."isDeleted" = false
            )
          )
        `;
      }

      // Haversine formula via raw SQL
      restaurants = await this.prisma.$queryRaw<any[]>(
        Prisma.sql`
          SELECT
            r.id,
            r.name,
            r.address,
            r.latitude,
            r.longitude,
            r."legalPhoto",
            r."ownerId",
            r.category,
            r."openingHours",
            r.branches,
            r."googleMapsUrl",
            r.description,
            r."isOpen",
            r."createdAt",
            r."updatedAt",
            (
              6371 * acos(
                LEAST(1.0, GREATEST(-1.0,
                  cos(radians(${lat})) * cos(radians(r.latitude))
                  * cos(radians(r.longitude) - radians(${lng}))
                  + sin(radians(${lat})) * sin(radians(r.latitude))
                ))
              )
            ) AS distance
          FROM restaurants r
          INNER JOIN users u ON r."ownerId" = u.id
          WHERE u.status = 'ACTIVE'
          ${searchFilter}
          ORDER BY distance ${Prisma.raw(sortOrder)}
          LIMIT ${limit} OFFSET ${offset}
        `,
      );

      // Count total for pagination
      const countResult = await this.prisma.$queryRaw<[{ count: bigint }]>(
        Prisma.sql`
          SELECT COUNT(*)::bigint AS count
          FROM restaurants r
          INNER JOIN users u ON r."ownerId" = u.id
          WHERE u.status = 'ACTIVE'
          ${searchFilter}
        `,
      );
      total = Number(countResult[0].count);
    } else {
      // Without coordinates — standard Prisma query
      const where: Prisma.RestaurantWhereInput = {
        owner: { status: 'ACTIVE' },
      };

      if (query.search) {
        where.OR = [
          { name: { contains: query.search, mode: 'insensitive' } },
          { address: { contains: query.search, mode: 'insensitive' } },
          { category: { contains: query.search, mode: 'insensitive' } },
          { description: { contains: query.search, mode: 'insensitive' } },
          { menus: { some: { name: { contains: query.search, mode: 'insensitive' }, isDeleted: false } } },
        ];
      }

      [restaurants, total] = await Promise.all([
        this.prisma.restaurant.findMany({
          where,
          skip: offset,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.restaurant.count({
          where,
        }),
      ]);
    }

    // Runtime Promo Check
    const restaurantIds = restaurants.map((r: any) => r.id);

    const promos = restaurantIds.length
      ? await this.prisma.promo.findMany({
          where: { restaurantId: { in: restaurantIds } },
        })
      : [];

    // Get current server time in HH:MM format (WIB / UTC+7)
    const now = new Date();
    const wibOffset = 7 * 60; // UTC+7 in minutes
    const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
    const wibMinutes = (utcMinutes + wibOffset) % (24 * 60);
    const currentHours = Math.floor(wibMinutes / 60);
    const currentMins = wibMinutes % 60;
    const currentTime = `${String(currentHours).padStart(2, '0')}:${String(currentMins).padStart(2, '0')}`;

    // Map promo status to each restaurant
    const enrichedRestaurants = restaurants.map((restaurant: any) => {
      const restoPromos = promos.filter(
        (p) => p.restaurantId === restaurant.id,
      );

      let isPromoActive = false;
      let discountDisplay: string | null = null;

      for (const promo of restoPromos) {
        if (currentTime >= promo.startHour && currentTime <= promo.endHour) {
          isPromoActive = true;
          discountDisplay = `${promo.discount}%`;
          break; // Ambil promo pertama yang aktif
        }
      }

      return {
        ...restaurant,
        // Convert distance from BigDecimal to number if present
        ...(restaurant.distance !== undefined && {
          distance: parseFloat(Number(restaurant.distance).toFixed(2)),
        }),
        isPromoActive,
        discountDisplay,
      };
    });

    return {
      restaurants: enrichedRestaurants,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOnePublic(id: string) {
    const restaurant = await this.prisma.restaurant.findFirst({
      where: {
        id,
        owner: { status: 'ACTIVE' },
      },
      include: { owner: { select: { name: true } } },
    });
    if (!restaurant) throw new NotFoundException('Restoran tidak ditemukan atau belum disetujui');
    return restaurant;
  }

  async getMenusPublic(restaurantId: string) {
    const restaurant = await this.findOnePublic(restaurantId);
    const menus = await this.prisma.menu.findMany({
      where: { restaurantId: restaurant.id, isDeleted: false },
    });
    return this.applyPromosToMenus(menus);
  }

  async getMenuDetailPublic(restaurantId: string, menuId: string) {
    const restaurant = await this.findOnePublic(restaurantId);
    const menu = await this.prisma.menu.findFirst({
      where: { id: menuId, restaurantId: restaurant.id, isDeleted: false },
    });
    if (!menu) throw new NotFoundException('Menu tidak ditemukan');
    const [enriched] = await this.applyPromosToMenus([menu]);
    return enriched;
  }

  async getVouchersPublic(restaurantId: string) {
    const restaurant = await this.findOnePublic(restaurantId);
    return this.prisma.voucher.findMany({
      where: {
        restaurantId: restaurant.id,
        expiryDate: { gte: new Date() },
        stock: { gt: 0 },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getVoucherDetailPublic(restaurantId: string, voucherId: string) {
    const restaurant = await this.findOnePublic(restaurantId);
    const voucher = await this.prisma.voucher.findFirst({
      where: {
        id: voucherId,
        restaurantId: restaurant.id,
      },
      include: {
        restaurant: {
          select: { name: true, address: true },
        },
      },
    });
    if (!voucher) throw new NotFoundException('Voucher tidak ditemukan');
    return voucher;
  }

  async getPromosPublic(restaurantId: string) {
    const restaurant = await this.findOnePublic(restaurantId);
    const promos = await this.prisma.promo.findMany({
      where: { restaurantId: restaurant.id },
      include: { menus: { select: { id: true, name: true, price: true, image: true } } },
      orderBy: { createdAt: 'desc' },
    });

    // Enrich with isActive status based on current WIB time
    const now = new Date();
    const wibOffset = 7 * 60;
    const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
    const wibMinutes = (utcMinutes + wibOffset) % (24 * 60);
    const currentHours = Math.floor(wibMinutes / 60);
    const currentMins = wibMinutes % 60;
    const currentTime = `${String(currentHours).padStart(2, '0')}:${String(currentMins).padStart(2, '0')}`;

    return promos.map((promo) => ({
      ...promo,
      isActive: currentTime >= promo.startHour && currentTime <= promo.endHour,
    }));
  }

  async getPromoDetailPublic(restaurantId: string, promoId: string) {
    const restaurant = await this.findOnePublic(restaurantId);
    const promo = await this.prisma.promo.findFirst({
      where: { id: promoId, restaurantId: restaurant.id },
      include: { menus: { select: { id: true, name: true, price: true, image: true } } },
    });
    if (!promo) throw new NotFoundException('Promo tidak ditemukan');

    const now = new Date();
    const wibOffset = 7 * 60;
    const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
    const wibMinutes = (utcMinutes + wibOffset) % (24 * 60);
    const currentHours = Math.floor(wibMinutes / 60);
    const currentMins = wibMinutes % 60;
    const currentTime = `${String(currentHours).padStart(2, '0')}:${String(currentMins).padStart(2, '0')}`;

    return {
      ...promo,
      isActive: currentTime >= promo.startHour && currentTime <= promo.endHour,
    };
  }

  async getAllMenusPublicWithPagination(query: { page?: string; limit?: string; search?: string }) {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '10', 10);
    const offset = (page - 1) * limit;

    const where: Prisma.MenuWhereInput = {
      restaurant: {
        owner: { status: 'ACTIVE' },
      },
      isDeleted: false,
    };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const [menus, total] = await Promise.all([
      this.prisma.menu.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { restaurant: { select: { id: true, name: true, address: true, latitude: true, longitude: true } } },
      }),
      this.prisma.menu.count({ where }),
    ]);

    const enrichedMenus = await this.applyPromosToMenus(menus);

    return {
      menus: enrichedMenus,
      pagination: {
        page,
        limit,
        total,
      },
    };
  }

  // ==================== ALL VOUCHERS & PROMOS (PUBLIC, NO ID) ====================

  async getAllVouchersPublic(query: { page?: string; limit?: string }) {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '10', 10);
    const offset = (page - 1) * limit;

    const where: Prisma.VoucherWhereInput = {
      restaurant: { owner: { status: 'ACTIVE' } },
      expiryDate: { gte: new Date() },
      stock: { gt: 0 },
    };

    const [vouchers, total] = await Promise.all([
      this.prisma.voucher.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          restaurant: {
            select: { id: true, name: true, address: true },
          },
        },
      }),
      this.prisma.voucher.count({ where }),
    ]);

    return {
      vouchers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAllPromosPublic(query: { page?: string; limit?: string }) {
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '10', 10);
    const offset = (page - 1) * limit;

    const where: Prisma.PromoWhereInput = {
      restaurant: { owner: { status: 'ACTIVE' } },
    };

    const [promos, total] = await Promise.all([
      this.prisma.promo.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          menus: { select: { id: true, name: true, price: true, image: true } },
          restaurant: {
            select: { id: true, name: true, address: true },
          },
        },
      }),
      this.prisma.promo.count({ where }),
    ]);

    // Enrich with isActive status based on current WIB time
    const now = new Date();
    const wibOffset = 7 * 60;
    const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
    const wibMinutes = (utcMinutes + wibOffset) % (24 * 60);
    const currentHours = Math.floor(wibMinutes / 60);
    const currentMins = wibMinutes % 60;
    const currentTime = `${String(currentHours).padStart(2, '0')}:${String(currentMins).padStart(2, '0')}`;

    const enrichedPromos = promos.map((promo) => ({
      ...promo,
      isActive: currentTime >= promo.startHour && currentTime <= promo.endHour,
    }));

    return {
      promos: enrichedPromos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async applyPromosToMenus(menus: any[]) {
    if (!menus.length) return menus;

    const restaurantIds = [...new Set(menus.map((m) => m.restaurantId))];

    // Get active promos for these restaurants
    const promos = await this.prisma.promo.findMany({
      where: { restaurantId: { in: restaurantIds } },
      include: { menus: { select: { id: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const now = new Date();
    const wibOffset = 7 * 60; // UTC+7 in minutes
    const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
    const wibMinutes = (utcMinutes + wibOffset) % (24 * 60);
    const currentHours = Math.floor(wibMinutes / 60);
    const currentMins = wibMinutes % 60;
    const currentTime = `${String(currentHours).padStart(2, '0')}:${String(currentMins).padStart(2, '0')}`;

    const activePromos = promos.filter(p => currentTime >= p.startHour && currentTime <= p.endHour);

    return menus.map((menu) => {
      // Find the first matching active promo (which is the newest due to desc order)
      const appliedPromo = activePromos.find((p) => {
        if (p.restaurantId !== menu.restaurantId) return false;
        if (p.type === 'ALL') return true;
        if (p.type === 'SPECIFIC') {
           return p.menus.some(pm => pm.id === menu.id);
        }
        return false;
      });

      if (appliedPromo) {
        const discountPercentage = appliedPromo.discount;
        const discountedPrice = menu.price - (menu.price * discountPercentage / 100);
        return { ...menu, discountPercentage, discountedPrice };
      }

      return { ...menu, discountPercentage: null, discountedPrice: null };
    });
  }
}
