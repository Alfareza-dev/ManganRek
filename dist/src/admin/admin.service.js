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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async updateApproval(userId, dto) {
        if (dto.status !== client_1.AccountStatus.ACTIVE &&
            dto.status !== client_1.AccountStatus.REJECTED) {
            throw new common_1.BadRequestException('Status hanya boleh ACTIVE atau REJECTED');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.NotFoundException('User tidak ditemukan');
        }
        if (user.role !== client_1.Role.ADMIN_RESTO) {
            throw new common_1.BadRequestException('Hanya akun ADMIN_RESTO yang dapat di-approve/reject');
        }
        if (user.status !== client_1.AccountStatus.PENDING) {
            throw new common_1.BadRequestException(`Akun sudah diproses sebelumnya (status saat ini: ${user.status})`);
        }
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: { status: dto.status },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return updatedUser;
    }
    async getPendingApprovals() {
        return this.prisma.user.findMany({
            where: {
                role: client_1.Role.ADMIN_RESTO,
                status: client_1.AccountStatus.PENDING,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                status: true,
                createdAt: true,
                restaurant: {
                    select: {
                        id: true,
                        name: true,
                        address: true,
                        legalPhoto: true,
                    },
                },
            },
        });
    }
    async getUsers(page, limit) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.user.findMany({
                where: { role: { in: [client_1.Role.USER, client_1.Role.KASIR] }, isDeleted: false },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.user.count({ where: { role: { in: [client_1.Role.USER, client_1.Role.KASIR] }, isDeleted: false } }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async getOwners(page, limit) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.user.findMany({
                where: { role: client_1.Role.ADMIN_RESTO, isDeleted: false },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: { restaurant: true },
            }),
            this.prisma.user.count({ where: { role: client_1.Role.ADMIN_RESTO, isDeleted: false } }),
        ]);
        return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async getUserById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                restaurant: true,
                managedResto: true,
            },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
    async getOwnerById(id) {
        const owner = await this.prisma.user.findFirst({
            where: { id, role: client_1.Role.ADMIN_RESTO },
            include: { restaurant: true },
        });
        if (!owner)
            throw new common_1.NotFoundException('Owner not found');
        return owner;
    }
    async toggleBanUser(id) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const newStatus = user.status === client_1.AccountStatus.REJECTED ? client_1.AccountStatus.ACTIVE : client_1.AccountStatus.REJECTED;
        return this.prisma.user.update({
            where: { id },
            data: { status: newStatus },
            select: { id: true, email: true, status: true },
        });
    }
    async deleteUser(id) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        await this.prisma.user.update({
            where: { id },
            data: { isDeleted: true }
        });
        return { message: 'User berhasil dihapus' };
    }
    async upsertConfig(key, value) {
        return this.prisma.systemConfig.upsert({
            where: { key },
            update: { value },
            create: { key, value },
        });
    }
    async getConfig(key) {
        const config = await this.prisma.systemConfig.findUnique({
            where: { key },
        });
        return config ? config.value : null;
    }
    async getAllPayments(page, limit) {
        const skip = (page - 1) * limit;
        const [transactions, totalTransactions, orders, totalOrders] = await Promise.all([
            this.prisma.transaction.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { name: true, email: true } },
                    voucher: { select: { title: true, restaurant: { select: { name: true } } } }
                }
            }),
            this.prisma.transaction.count(),
            this.prisma.order.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    restaurant: { select: { name: true } },
                    cashier: { select: { name: true } }
                }
            }),
            this.prisma.order.count(),
        ]);
        return {
            transactions: {
                data: transactions,
                total: totalTransactions,
                page,
                limit,
                totalPages: Math.ceil(totalTransactions / limit)
            },
            orders: {
                data: orders,
                total: totalOrders,
                page,
                limit,
                totalPages: Math.ceil(totalOrders / limit)
            }
        };
    }
    async deleteRestaurantPermanently(id) {
        const restaurant = await this.prisma.restaurant.findUnique({
            where: { id },
            include: { cashiers: true }
        });
        if (!restaurant) {
            throw new common_1.NotFoundException('Restoran tidak ditemukan');
        }
        const cashierIds = restaurant.cashiers.map(c => c.id);
        const ownerId = restaurant.ownerId;
        await this.prisma.user.updateMany({
            where: {
                OR: [
                    { managedRestoId: id },
                    { id: { in: [ownerId, ...cashierIds] } }
                ]
            },
            data: { managedRestoId: null }
        });
        await this.prisma.transaction.deleteMany({
            where: {
                OR: [
                    { voucher: { restaurantId: id } },
                    { userId: { in: [ownerId, ...cashierIds] } }
                ]
            }
        });
        await this.prisma.orderItem.deleteMany({
            where: {
                menu: {
                    restaurantId: id
                }
            }
        });
        await this.prisma.order.deleteMany({
            where: { restaurantId: id }
        });
        await this.prisma.restaurant.delete({
            where: { id }
        });
        if (cashierIds.length > 0) {
            try {
                await this.prisma.user.deleteMany({
                    where: { id: { in: cashierIds } }
                });
            }
            catch (error) {
                console.warn(`Gagal menghapus kasir dari restoran ${id}:`, error);
            }
        }
        try {
            await this.prisma.user.delete({
                where: { id: ownerId }
            });
        }
        catch (error) {
            console.warn(`Gagal menghapus owner dari restoran ${id}:`, error);
        }
        return { message: 'Restoran beserta seluruh data terkait (Owner, Kasir, Transaksi, dll) berhasil dihapus permanen' };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map