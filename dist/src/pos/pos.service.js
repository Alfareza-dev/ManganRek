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
};
exports.PosService = PosService;
exports.PosService = PosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PosService);
//# sourceMappingURL=pos.service.js.map