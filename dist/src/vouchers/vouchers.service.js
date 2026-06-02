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
exports.VouchersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const config_1 = require("@nestjs/config");
let VouchersService = class VouchersService {
    prisma;
    configService;
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
    }
    async getAdminResto(adminId) {
        const resto = await this.prisma.restaurant.findUnique({
            where: { ownerId: adminId }
        });
        if (!resto)
            throw new common_1.NotFoundException('Restoran tidak ditemukan');
        return resto;
    }
    async create(adminId, dto) {
        const resto = await this.getAdminResto(adminId);
        return this.prisma.voucher.create({
            data: {
                title: dto.title,
                price: dto.price,
                value: dto.value,
                stock: dto.stock,
                expiryDate: new Date(dto.expiryDate),
                restaurantId: resto.id
            }
        });
    }
    async findAll(adminId) {
        const resto = await this.getAdminResto(adminId);
        return this.prisma.voucher.findMany({
            where: { restaurantId: resto.id }
        });
    }
    async findOne(adminId, id) {
        const resto = await this.getAdminResto(adminId);
        const voucher = await this.prisma.voucher.findFirst({
            where: { id, restaurantId: resto.id }
        });
        if (!voucher)
            throw new common_1.NotFoundException('Voucher tidak ditemukan');
        return voucher;
    }
    async update(adminId, id, dto) {
        const resto = await this.getAdminResto(adminId);
        const voucher = await this.prisma.voucher.findFirst({
            where: { id, restaurantId: resto.id }
        });
        if (!voucher)
            throw new common_1.NotFoundException('Voucher tidak ditemukan');
        const dataToUpdate = { ...dto };
        if (dto.expiryDate) {
            dataToUpdate.expiryDate = new Date(dto.expiryDate);
        }
        return this.prisma.voucher.update({
            where: { id },
            data: dataToUpdate
        });
    }
    async remove(adminId, id) {
        const resto = await this.getAdminResto(adminId);
        const voucher = await this.prisma.voucher.findFirst({
            where: { id, restaurantId: resto.id }
        });
        if (!voucher)
            throw new common_1.NotFoundException('Voucher tidak ditemukan');
        return this.prisma.voucher.delete({
            where: { id }
        });
    }
    async buyVoucher(userId, dto) {
        const voucher = await this.prisma.voucher.findUnique({
            where: { id: dto.voucherId }
        });
        if (!voucher)
            throw new common_1.NotFoundException('Voucher tidak ditemukan');
        if (voucher.expiryDate < new Date()) {
            throw new common_1.BadRequestException('Voucher sudah kadaluarsa');
        }
        if (voucher.stock <= 0) {
            throw new common_1.BadRequestException('Stok voucher habis');
        }
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        await this.prisma.voucher.update({
            where: { id: voucher.id },
            data: { stock: { decrement: 1 } }
        });
        const transaction = await this.prisma.transaction.create({
            data: {
                userId,
                voucherId: voucher.id,
                status: 'PENDING',
                totalPaid: voucher.price
            }
        });
        const apiKey = this.configService.get('LOUVIN_API_KEY');
        if (!apiKey)
            throw new common_1.InternalServerErrorException('Konfigurasi Payment Gateway belum diatur');
        try {
            const res = await fetch("https://api.louvin.dev/create-transaction", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": apiKey
                },
                body: JSON.stringify({
                    amount: voucher.price,
                    payment_type: "qris",
                    customer_name: user?.name || "Customer",
                    reference: transaction.id
                })
            });
            const louvinData = await res.json();
            if (!res.ok || !louvinData.success) {
                throw new Error(louvinData.error || 'Gagal membuat transaksi di Louvin');
            }
            const updatedTx = await this.prisma.transaction.update({
                where: { id: transaction.id },
                data: { paymentUrl: louvinData.payment.qr_string }
            });
            return updatedTx;
        }
        catch (err) {
            await this.prisma.transaction.delete({ where: { id: transaction.id } });
            await this.prisma.voucher.update({
                where: { id: voucher.id },
                data: { stock: { increment: 1 } }
            });
            throw new common_1.InternalServerErrorException(err.message);
        }
    }
    generateUniqueCode(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
    async handleWebhook(payload) {
        if (payload.event === 'payment.settled') {
            const reference = payload.data?.reference || payload.data?.order_id;
            if (!reference)
                return { received: true };
            const tx = await this.prisma.transaction.findUnique({
                where: { id: reference }
            });
            if (tx && tx.status === 'PENDING') {
                const uniqueCode = this.generateUniqueCode(8);
                await this.prisma.transaction.update({
                    where: { id: tx.id },
                    data: {
                        status: 'PAID',
                        uniqueCode: uniqueCode
                    }
                });
            }
        }
        return { received: true };
    }
    async verifyMockTransaction(transactionId) {
        const tx = await this.prisma.transaction.findUnique({
            where: { id: transactionId }
        });
        if (!tx)
            throw new common_1.NotFoundException('Transaksi tidak ditemukan');
        if (tx.status !== 'PENDING')
            throw new common_1.BadRequestException('Transaksi tidak dalam status PENDING');
        const uniqueCode = this.generateUniqueCode(8);
        let feePercentage = 0;
        const config = await this.prisma.systemConfig.findUnique({
            where: { key: 'VOUCHER_FEE_PERCENTAGE' }
        });
        if (config) {
            feePercentage = parseFloat(config.value) || 0;
        }
        const platformFee = tx.totalPaid * (feePercentage / 100);
        return this.prisma.transaction.update({
            where: { id: tx.id },
            data: {
                status: 'PAID',
                uniqueCode,
                platformFee
            }
        });
    }
    async findAllPublic() {
        return this.prisma.voucher.findMany({
            include: {
                restaurant: {
                    select: { name: true, address: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async findByRestoPublic(restoId) {
        return this.prisma.voucher.findMany({
            where: { restaurantId: restoId },
            orderBy: { createdAt: 'desc' }
        });
    }
    async getUserHistory(userId) {
        return this.prisma.transaction.findMany({
            where: { userId },
            include: {
                voucher: {
                    include: {
                        restaurant: {
                            select: { name: true, address: true, legalPhoto: true }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
};
exports.VouchersService = VouchersService;
exports.VouchersService = VouchersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], VouchersService);
//# sourceMappingURL=vouchers.service.js.map