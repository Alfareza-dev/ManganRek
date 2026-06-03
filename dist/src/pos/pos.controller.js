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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PosController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const pos_service_1 = require("./pos.service");
const validate_voucher_dto_1 = require("./dto/validate-voucher.dto");
const create_order_dto_1 = require("./dto/create-order.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let PosController = class PosController {
    posService;
    constructor(posService) {
        this.posService = posService;
    }
    async validateVoucher(req, dto) {
        const user = req.user;
        const data = await this.posService.validateVoucher(user.userId, dto);
        return {
            success: true,
            message: `Voucher valid! Potongan belanja sebesar ${data.value} berhasil digunakan.`,
            data
        };
    }
    async createOrder(req, dto) {
        const user = req.user;
        const data = await this.posService.createOrder(user.userId, dto);
        return data;
    }
    async getMenus(req) {
        const user = req.user;
        const data = await this.posService.getMenus(user.userId);
        return {
            success: true,
            message: 'Daftar menu berhasil dimuat',
            data
        };
    }
    async getOrderHistory(req) {
        const user = req.user;
        const data = await this.posService.getOrderHistory(user.userId);
        return {
            success: true,
            message: 'Riwayat order kasir berhasil diambil',
            data
        };
    }
    async cancelOrder(req, id) {
        const user = req.user;
        const data = await this.posService.cancelOrder(user.userId, id);
        return {
            success: true,
            message: 'Order berhasil dibatalkan',
            data
        };
    }
    async verifyMockOrder(id) {
        const data = await this.posService.verifyMockOrder(id);
        return {
            success: true,
            message: 'Mock verifikasi sukses. Status order menjadi SETTLED.',
            data
        };
    }
};
exports.PosController = PosController;
__decorate([
    (0, common_1.Post)('validate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.KASIR),
    (0, swagger_1.ApiOperation)({ summary: 'Validasi Voucher (Cek status dan potongan harga)' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, validate_voucher_dto_1.ValidateVoucherDto]),
    __metadata("design:returntype", Promise)
], PosController.prototype, "validateVoucher", null);
__decorate([
    (0, common_1.Post)('orders'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.KASIR),
    (0, swagger_1.ApiOperation)({ summary: 'Buat Order POS Kasir' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_order_dto_1.CreateOrderDto]),
    __metadata("design:returntype", Promise)
], PosController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Get)('menus'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.KASIR),
    (0, swagger_1.ApiOperation)({ summary: 'Ambil daftar menu restoran Kasir (termasuk diskon)' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PosController.prototype, "getMenus", null);
__decorate([
    (0, common_1.Get)('orders/history'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.KASIR),
    (0, swagger_1.ApiOperation)({ summary: 'Ambil riwayat order kasir' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PosController.prototype, "getOrderHistory", null);
__decorate([
    (0, common_1.Patch)('orders/:id/cancel'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.KASIR),
    (0, swagger_1.ApiOperation)({ summary: 'Batalkan order kasir yang PENDING' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PosController.prototype, "cancelOrder", null);
__decorate([
    (0, common_1.Patch)('orders/:id/verify-mock'),
    (0, swagger_1.ApiOperation)({ summary: 'Mock verifikasi order QRIS (Ubah PENDING menjadi SETTLED)' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PosController.prototype, "verifyMockOrder", null);
exports.PosController = PosController = __decorate([
    (0, swagger_1.ApiTags)('POS Kasir'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('api/pos'),
    __metadata("design:paramtypes", [pos_service_1.PosService])
], PosController);
//# sourceMappingURL=pos.controller.js.map