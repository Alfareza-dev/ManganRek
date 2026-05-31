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
let PosService = class PosService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
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
        const updatedTx = await this.prisma.transaction.update({
            where: { id: tx.id },
            data: { status: 'USED' }
        });
        return {
            transactionId: updatedTx.id,
            voucherTitle: tx.voucher.title,
            value: tx.voucher.value,
            status: 'USED'
        };
    }
    async getMenus(cashierId) {
        const cashier = await this.prisma.user.findUnique({
            where: { id: cashierId }
        });
        if (!cashier || !cashier.managedRestoId) {
            throw new common_1.ForbiddenException('Akses ditolak: Kasir tidak terdaftar pada restoran manapun');
        }
        return this.prisma.menu.findMany({
            where: { restaurantId: cashier.managedRestoId, isAvailable: true }
        });
    }
    async createOrder(cashierId, dto) {
        const cashier = await this.prisma.user.findUnique({
            where: { id: cashierId }
        });
        if (!cashier || !cashier.managedRestoId) {
            throw new common_1.ForbiddenException('Akses ditolak: Kasir tidak terdaftar pada restoran manapun');
        }
        const menuIds = dto.items.map(i => i.menuId);
        const menus = await this.prisma.menu.findMany({
            where: { id: { in: menuIds }, restaurantId: cashier.managedRestoId }
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
        const discount = 0;
        const finalAmount = totalAmount - discount;
        const orderStatus = dto.paymentMethod === 'CASH' ? 'SETTLED' : 'PENDING';
        const order = await this.prisma.order.create({
            data: {
                restaurantId: cashier.managedRestoId,
                cashierId: cashier.id,
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
                        "Content-Type": "application/json"
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
};
exports.PosService = PosService;
exports.PosService = PosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PosService);
//# sourceMappingURL=pos.service.js.map