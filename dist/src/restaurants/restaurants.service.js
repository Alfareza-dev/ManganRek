"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let RestaurantsService = class RestaurantsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOwnedRestaurant(userId) {
        const restaurant = await this.prisma.restaurant.findUnique({
            where: { ownerId: userId },
        });
        if (!restaurant) {
            throw new common_1.NotFoundException('Restoran tidak ditemukan untuk akun ini');
        }
        return restaurant;
    }
    async createMenu(userId, dto) {
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
    async updateMenu(userId, menuId, dto) {
        const restaurant = await this.getOwnedRestaurant(userId);
        const menu = await this.prisma.menu.findUnique({
            where: { id: menuId },
        });
        if (!menu) {
            throw new common_1.NotFoundException('Menu tidak ditemukan');
        }
        if (menu.restaurantId !== restaurant.id) {
            throw new common_1.ForbiddenException('Anda tidak memiliki akses ke menu ini');
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
    async deleteMenu(userId, menuId) {
        const restaurant = await this.getOwnedRestaurant(userId);
        const menu = await this.prisma.menu.findUnique({
            where: { id: menuId },
        });
        if (!menu) {
            throw new common_1.NotFoundException('Menu tidak ditemukan');
        }
        if (menu.restaurantId !== restaurant.id) {
            throw new common_1.ForbiddenException('Anda tidak memiliki akses ke menu ini');
        }
        await this.prisma.menu.delete({ where: { id: menuId } });
        return { deleted: true };
    }
    async createPromo(userId, dto) {
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
    async updatePromo(userId, promoId, dto) {
        const restaurant = await this.getOwnedRestaurant(userId);
        const promo = await this.prisma.promo.findUnique({
            where: { id: promoId },
        });
        if (!promo) {
            throw new common_1.NotFoundException('Promo tidak ditemukan');
        }
        if (promo.restaurantId !== restaurant.id) {
            throw new common_1.ForbiddenException('Anda tidak memiliki akses ke promo ini');
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
    async deletePromo(userId, promoId) {
        const restaurant = await this.getOwnedRestaurant(userId);
        const promo = await this.prisma.promo.findUnique({
            where: { id: promoId },
        });
        if (!promo) {
            throw new common_1.NotFoundException('Promo tidak ditemukan');
        }
        if (promo.restaurantId !== restaurant.id) {
            throw new common_1.ForbiddenException('Anda tidak memiliki akses ke promo ini');
        }
        await this.prisma.promo.delete({ where: { id: promoId } });
        return { deleted: true };
    }
    async findAllPublic(query) {
        const page = parseInt(query.page || '1', 10);
        const limit = parseInt(query.limit || '10', 10);
        const offset = (page - 1) * limit;
        const hasCoordinates = query.lat && query.lng;
        let restaurants;
        let total;
        if (hasCoordinates) {
            const lat = parseFloat(query.lat);
            const lng = parseFloat(query.lng);
            const sortOrder = query.sort === 'terjauh' ? 'DESC' : 'ASC';
            restaurants = await this.prisma.$queryRaw(client_1.Prisma.sql `
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
          ORDER BY distance ${client_1.Prisma.raw(sortOrder)}
          LIMIT ${limit} OFFSET ${offset}
        `);
            const countResult = await this.prisma.$queryRaw(client_1.Prisma.sql `
          SELECT COUNT(*)::bigint AS count
          FROM restaurants r
          INNER JOIN users u ON r."ownerId" = u.id
          WHERE u.status = 'ACTIVE'
        `);
            total = Number(countResult[0].count);
        }
        else {
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
        const restaurantIds = restaurants.map((r) => r.id);
        const promos = restaurantIds.length
            ? await this.prisma.promo.findMany({
                where: { restaurantId: { in: restaurantIds } },
            })
            : [];
        const now = new Date();
        const wibOffset = 7 * 60;
        const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
        const wibMinutes = (utcMinutes + wibOffset) % (24 * 60);
        const currentHours = Math.floor(wibMinutes / 60);
        const currentMins = wibMinutes % 60;
        const currentTime = `${String(currentHours).padStart(2, '0')}:${String(currentMins).padStart(2, '0')}`;
        const enrichedRestaurants = restaurants.map((restaurant) => {
            const restoPromos = promos.filter((p) => p.restaurantId === restaurant.id);
            let isPromoActive = false;
            let discountDisplay = null;
            for (const promo of restoPromos) {
                if (currentTime >= promo.startHour && currentTime <= promo.endHour) {
                    isPromoActive = true;
                    discountDisplay = `${promo.discount}%`;
                    break;
                }
            }
            return {
                ...restaurant,
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
};
exports.RestaurantsService = RestaurantsService;
exports.RestaurantsService = RestaurantsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RestaurantsService);
//# sourceMappingURL=restaurants.service.js.map