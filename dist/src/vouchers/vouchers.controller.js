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
exports.VouchersController = void 0;
const common_1 = require("@nestjs/common");
const vouchers_service_1 = require("./vouchers.service");
const create_voucher_dto_1 = require("./dto/create-voucher.dto");
const update_voucher_dto_1 = require("./dto/update-voucher.dto");
const buy_voucher_dto_1 = require("./dto/buy-voucher.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let VouchersController = class VouchersController {
    vouchersService;
    constructor(vouchersService) {
        this.vouchersService = vouchersService;
    }
    async create(req, dto) {
        const user = req.user;
        const data = await this.vouchersService.create(user.userId, dto);
        return { success: true, message: 'Voucher berhasil dibuat', data };
    }
    async findAll(req) {
        const user = req.user;
        const data = await this.vouchersService.findAll(user.userId);
        return { success: true, message: 'Daftar voucher', data };
    }
    async update(req, id, dto) {
        const user = req.user;
        const data = await this.vouchersService.update(user.userId, id, dto);
        return { success: true, message: 'Voucher berhasil diperbarui', data };
    }
    async remove(req, id) {
        const user = req.user;
        await this.vouchersService.remove(user.userId, id);
        return { success: true, message: 'Voucher berhasil dihapus' };
    }
    async buyVoucher(req, dto) {
        const user = req.user;
        const data = await this.vouchersService.buyVoucher(user.userId, dto);
        return { success: true, message: 'Transaksi berhasil dibuat', data };
    }
    async handleWebhook(payload) {
        return this.vouchersService.handleWebhook(payload);
    }
};
exports.VouchersController = VouchersController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN_RESTO),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_voucher_dto_1.CreateVoucherDto]),
    __metadata("design:returntype", Promise)
], VouchersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN_RESTO),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VouchersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN_RESTO),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_voucher_dto_1.UpdateVoucherDto]),
    __metadata("design:returntype", Promise)
], VouchersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN_RESTO),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], VouchersController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('buy'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.USER),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, buy_voucher_dto_1.BuyVoucherDto]),
    __metadata("design:returntype", Promise)
], VouchersController.prototype, "buyVoucher", null);
__decorate([
    (0, common_1.Post)('webhook'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VouchersController.prototype, "handleWebhook", null);
exports.VouchersController = VouchersController = __decorate([
    (0, common_1.Controller)('api/vouchers'),
    __metadata("design:paramtypes", [vouchers_service_1.VouchersService])
], VouchersController);
//# sourceMappingURL=vouchers.controller.js.map