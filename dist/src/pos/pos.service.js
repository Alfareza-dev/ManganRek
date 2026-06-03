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
exports.PosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const restaurants_service_1 = require("../restaurants/restaurants.service");
let PosService = class PosService {
    prisma;
    restaurantsService;
    constructor(prisma, restaurantsService) {
        this.prisma = prisma;
        this.restaurantsService = restaurantsService;
    }
    async validateVoucher(cashierId, dto) {
        const cashier = await this.prisma.user.findUnique({
            where: { id: cashierId }
        });
        if (!cashier || !cashier.managedRestoId) {
            throw new common_1.ForbiddenException('Akses ditolak: Kasir tidak terdaftar pada restoran manapun');
        }
        const tx = await this.prisma.transaction.findUnique({
            where: { uniqueCode: dto.uniqueCode },
            include: { voucher: true }
        });
        if (!tx || !tx.voucher) {
            throw new common_1.NotFoundException('Kode voucher tidak ditemukan');
        }
        if (tx.status !== 'PAID') {
            if (tx.status === 'USED')
                throw new common_1.BadRequestException('Voucher ini sudah pernah digunakan');
            throw new common_1.BadRequestException('Voucher belum lunas / tidak valid');
        }
        if (tx.voucher.restaurantId !== cashier.managedRestoId) {
            throw new common_1.ForbiddenException('Kode voucher ini tidak berlaku di restoran Anda');
        }
        if (new Date() > tx.voucher.expiryDate) {
            throw new common_1.BadRequestException('Voucher sudah kadaluarsa');
        }
        return {
            transactionId: tx.id,
            voucherTitle: tx.voucher.title,
            value: tx.voucher.value,
            status: 'VALID'
        };
    }
    async getMenus(cashierId) {
        const cashier = await this.prisma.user.findUnique({
            where: { id: cashierId }
        });
        if (!cashier || !cashier.managedRestoId) {
            throw new common_1.ForbiddenException('Akses ditolak: Kasir tidak terdaftar pada restoran manapun');
        }
        const menus = await this.prisma.menu.findMany({
            where: { restaurantId: cashier.managedRestoId }
        });
        return this.restaurantsService.applyPromosToMenus(menus);
    }
    async createOrder(cashierId, dto) {
        const cashier = await this.prisma.user.findUnique({
            where: { id: cashierId }
        });
        if (!cashier || !cashier.managedRestoId) {
            throw new common_1.ForbiddenException('Akses ditolak: Kasir tidak terdaftar pada restoran manapun');
        }
        const managedRestoId = cashier.managedRestoId;
        const menuIds = dto.items.map(i => i.menuId);
        const menus = await this.prisma.menu.findMany({
            where: { id: { in: menuIds }, restaurantId: managedRestoId }
        });
        if (menus.length !== menuIds.length) {
            throw new common_1.BadRequestException('Beberapa menu tidak valid atau bukan milik restoran ini');
        }
        let totalAmount = 0;
        const orderItemsData = dto.items.map(item => {
            const menu = menus.find(m => m.id === item.menuId);
            if (!menu)
                throw new common_1.BadRequestException('Menu tidak ditemukan');
            const price = menu.price;
            totalAmount += price * item.quantity;
            return {
                menuId: item.menuId,
                quantity: item.quantity,
                price: price
            };
        });
        let discount = 0;
        let validTxId;
        if (dto.voucherCode) {
            const tx = await this.prisma.transaction.findUnique({
                where: { uniqueCode: dto.voucherCode },
                include: { voucher: true }
            });
            if (!tx || !tx.voucher) {
                throw new common_1.NotFoundException('Kode voucher tidak ditemukan');
            }
            if (tx.status !== 'PAID') {
                if (tx.status === 'USED')
                    throw new common_1.BadRequestException('Voucher ini sudah pernah digunakan');
                throw new common_1.BadRequestException('Voucher belum lunas / tidak valid');
            }
            if (tx.voucher.restaurantId !== managedRestoId) {
                throw new common_1.ForbiddenException('Kode voucher ini tidak berlaku di restoran Anda');
            }
            if (new Date() > tx.voucher.expiryDate) {
                throw new common_1.BadRequestException('Voucher sudah kadaluarsa');
            }
            discount = tx.voucher.value;
            validTxId = tx.id;
        }
        if (discount > totalAmount) {
            discount = totalAmount;
        }
        const finalAmount = totalAmount - discount;
        const orderStatus = dto.paymentMethod === 'CASH' ? 'SETTLED' : 'PENDING';
        const order = await this.prisma.$transaction(async (prisma) => {
            const newOrder = await prisma.order.create({
                data: {
                    restaurantId: managedRestoId,
                    cashierId: cashier.id,
                    customerName: dto.customerName,
                    totalAmount,
                    discount,
                    finalAmount,
                    paymentMethod: dto.paymentMethod,
                    status: orderStatus,
                    items: {
                        create: orderItemsData
                    }
                },
                include: { items: true }
            });
            if (validTxId) {
                await prisma.transaction.update({
                    where: { id: validTxId },
                    data: { status: 'USED' }
                });
            }
            return newOrder;
        });
        if (dto.paymentMethod === 'CASH') {
            return {
                success: true,
                message: 'Order berhasil dibayar dengan CASH',
                order
            };
        }
        else if (dto.paymentMethod === 'QRIS') {
            try {
                const res = await fetch("https://api.louvin.dev/create-transaction", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": process.env.LOUVIN_API_KEY || ""
                    },
                    body: JSON.stringify({
                        amount: finalAmount,
                        payment_type: "qris",
                        reference: order.id
                    })
                });
                const louvinData = await res.json();
                let qr_string = "MOCK_QR_STRING_" + order.id;
                if (res.ok && louvinData.success && louvinData.payment && louvinData.payment.qr_string) {
                    qr_string = louvinData.payment.qr_string;
                }
                else if (!res.ok) {
                    console.log("Louvin API response not OK, using mock QR", louvinData);
                }
                return {
                    success: true,
                    message: 'Order dibuat. Silakan scan QRIS.',
                    order,
                    qr_string
                };
            }
            catch (err) {
                console.error("Error calling Louvin API", err);
                return {
                    success: true,
                    message: 'Order dibuat. Silakan scan QRIS (Mock fallback due to network error).',
                    order,
                    qr_string: "MOCK_QR_STRING_FALLBACK_" + order.id
                };
            }
        }
    }
    async getOrderHistory(cashierId) {
        return this.prisma.order.findMany({
            where: { cashierId },
            orderBy: { createdAt: 'desc' },
            include: { items: { include: { menu: { select: { name: true } } } } }
        });
    }
    async verifyMockOrder(orderId) {
        const order = await this.prisma.order.findUnique({ where: { id: orderId } });
        if (!order)
            throw new common_1.NotFoundException('Order tidak ditemukan');
        if (order.status !== 'PENDING') {
            throw new common_1.BadRequestException('Order tidak dalam status PENDING');
        }
        return this.prisma.order.update({
            where: { id: orderId },
            data: { status: 'SETTLED' }
        });
    }
    async cancelOrder(cashierId, orderId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true }
        });
        if (!order)
            throw new common_1.NotFoundException('Order tidak ditemukan');
        if (order.cashierId !== cashierId)
            throw new common_1.ForbiddenException('Akses ditolak: Ini bukan order Anda');
        if (order.status !== 'PENDING')
            throw new common_1.BadRequestException(`Order tidak bisa dibatalkan karena berstatus ${order.status}`);
        return this.prisma.order.update({
            where: { id: orderId },
            data: { status: 'CANCELLED' }
        });
    }
};
exports.PosService = PosService;
exports.PosService = PosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        restaurants_service_1.RestaurantsService])
], PosService);
//# sourceMappingURL=pos.service.js.map