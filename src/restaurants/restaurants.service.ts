import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { CreatePromoDto } from './dto/create-promo.dto';
import { UpdatePromoDto } from './dto/update-promo.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RestaurantsService {
  constructor(private prisma: PrismaService) {}

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

  // ==================== MENU CRUD ====================

  async createMenu(userId: string, dto: CreateMenuDto) {
    const restaurant = await this.getOwnedRestaurant(userId);
    return this.prisma.menu.create({
      data: {
        restaurantId: restaurant.id,
        name: dto.name,
        description: dto.description,
        price: dto.price,
        image: dto.image,
        isAvailable: dto.isAvailable ?? true,
      },
    });
  }

  async getMenu(userId: string, menuId: string) {
    const restaurant = await this.getOwnedRestaurant(userId);
    const menu = await this.prisma.menu.findUnique({
      where: { id: menuId },
    });
    if (!menu) throw new NotFoundException('Menu tidak ditemukan');
    if (menu.restaurantId !== restaurant.id) throw new ForbiddenException('Akses ditolak');
    return menu;
  }

  async updateMenu(userId: string, menuId: string, dto: UpdateMenuDto) {
    const restaurant = await this.getOwnedRestaurant(userId);

    // Cek apakah menu ini milik restoran user
    const menu = await this.prisma.menu.findUnique({
      where: { id: menuId },
    });
    if (!menu) {
      throw new NotFoundException('Menu tidak ditemukan');
    }
    if (menu.restaurantId !== restaurant.id) {
      throw new ForbiddenException('Anda tidak memiliki akses ke menu ini');
    }

    return this.prisma.menu.update({
      where: { id: menuId },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.price !== undefined && { price: dto.price }),
        ...(dto.image !== undefined && { image: dto.image }),
        ...(dto.isAvailable !== undefined && { isAvailable: dto.isAvailable }),
      },
    });
  }

  async deleteMenu(userId: string, menuId: string) {
    const restaurant = await this.getOwnedRestaurant(userId);

    const menu = await this.prisma.menu.findUnique({
      where: { id: menuId },
    });
    if (!menu) {
      throw new NotFoundException('Menu tidak ditemukan');
    }
    if (menu.restaurantId !== restaurant.id) {
      throw new ForbiddenException('Anda tidak memiliki akses ke menu ini');
    }

    await this.prisma.menu.delete({ where: { id: menuId } });
    return { deleted: true };
  }

  // ==================== PROMO CRUD ====================

  async createPromo(userId: string, dto: CreatePromoDto) {
    const restaurant = await this.getOwnedRestaurant(userId);
    return this.prisma.promo.create({
      data: {
        restaurantId: restaurant.id,
        discount: dto.discount,
        startHour: dto.startHour,
        endHour: dto.endHour,
      },
    });
  }

  async getPromo(userId: string, promoId: string) {
    const restaurant = await this.getOwnedRestaurant(userId);
    const promo = await this.prisma.promo.findUnique({
      where: { id: promoId },
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

    return this.prisma.promo.update({
      where: { id: promoId },
      data: {
        ...(dto.discount !== undefined && { discount: dto.discount }),
        ...(dto.startHour !== undefined && { startHour: dto.startHour }),
        ...(dto.endHour !== undefined && { endHour: dto.endHour }),
      },
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
        `,
      );
      total = Number(countResult[0].count);
    } else {
      // Without coordinates — standard Prisma query
      [restaurants, total] = await Promise.all([
        this.prisma.restaurant.findMany({
          where: {
            owner: { status: 'ACTIVE' },
          },
          skip: offset,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.restaurant.count({
          where: {
            owner: { status: 'ACTIVE' },
          },
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
    return this.prisma.menu.findMany({
      where: { restaurantId: restaurant.id, isAvailable: true },
    });
  }

  async getMenuDetailPublic(restaurantId: string, menuId: string) {
    const restaurant = await this.findOnePublic(restaurantId);
    const menu = await this.prisma.menu.findFirst({
      where: { id: menuId, restaurantId: restaurant.id, isAvailable: true },
    });
    if (!menu) throw new NotFoundException('Menu tidak ditemukan');
    return menu;
  }
}
