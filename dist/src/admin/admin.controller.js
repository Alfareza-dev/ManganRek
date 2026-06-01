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
exports.AdminController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const update_approval_dto_1 = require("./dto/update-approval.dto");
const system_config_dto_1 = require("./dto/system-config.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let AdminController = class AdminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    async updateConfig(dto) {
        const data = await this.adminService.upsertConfig(dto.key, dto.value);
        return { success: true, message: 'Konfigurasi berhasil disimpan', data };
    }
    async getConfig(key) {
        const targetKey = key || 'VOUCHER_FEE_PERCENTAGE';
        const value = await this.adminService.getConfig(targetKey);
        return { success: true, message: 'Konfigurasi berhasil diambil', data: { key: targetKey, value } };
    }
    async getRevenue() {
        const totalPlatformFee = await this.adminService.getPlatformRevenue();
        return { success: true, message: 'Total pendapatan platform', data: { totalPlatformFee } };
    }
    async getAllPayments(page = '1', limit = '10') {
        const data = await this.adminService.getAllPayments(Number(page), Number(limit));
        return { success: true, message: 'Berhasil mengambil histori pembayaran', data };
    }
    async getPendingApprovals() {
        const data = await this.adminService.getPendingApprovals();
        return {
            success: true,
            message: 'Daftar akun ADMIN_RESTO menunggu persetujuan',
            data,
        };
    }
    async updateApproval(id, dto) {
        const data = await this.adminService.updateApproval(id, dto);
        return {
            success: true,
            message: `Status akun berhasil diubah menjadi ${dto.status}`,
            data,
        };
    }
    async getUsers(page = '1', limit = '10') {
        const data = await this.adminService.getUsers(Number(page), Number(limit));
        return { success: true, message: 'Berhasil mengambil data user', data };
    }
    async getOwners(page = '1', limit = '10') {
        const data = await this.adminService.getOwners(Number(page), Number(limit));
        return { success: true, message: 'Berhasil mengambil data owner', data };
    }
    async getUserById(id) {
        const data = await this.adminService.getUserById(id);
        return { success: true, message: 'Berhasil mengambil detail user', data };
    }
    async getOwnerById(id) {
        const data = await this.adminService.getOwnerById(id);
        return { success: true, message: 'Berhasil mengambil detail owner', data };
    }
    async toggleBanUser(id) {
        const data = await this.adminService.toggleBanUser(id);
        return {
            success: true,
            message: `Status akun berhasil diubah menjadi ${data.status}`,
            data,
        };
    }
    async deleteUser(id) {
        const data = await this.adminService.deleteUser(id);
        return { success: true, message: data.message };
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Post)('config'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [system_config_dto_1.UpdateConfigDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateConfig", null);
__decorate([
    (0, common_1.Get)('config'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('key')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getConfig", null);
__decorate([
    (0, common_1.Get)('revenue'),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getRevenue", null);
__decorate([
    openapi.ApiQuery({ name: "page", required: false }),
    openapi.ApiQuery({ name: "limit", required: false }),
    (0, common_1.Get)('payments'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllPayments", null);
__decorate([
    (0, common_1.Get)('approvals'),
    openapi.ApiResponse({ status: 200 }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getPendingApprovals", null);
__decorate([
    (0, common_1.Patch)('approvals/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_approval_dto_1.UpdateApprovalDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateApproval", null);
__decorate([
    openapi.ApiQuery({ name: "page", required: false }),
    openapi.ApiQuery({ name: "limit", required: false }),
    (0, common_1.Get)('users'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUsers", null);
__decorate([
    openapi.ApiQuery({ name: "page", required: false }),
    openapi.ApiQuery({ name: "limit", required: false }),
    (0, common_1.Get)('owners'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getOwners", null);
__decorate([
    (0, common_1.Get)('users/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUserById", null);
__decorate([
    (0, common_1.Get)('owners/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getOwnerById", null);
__decorate([
    (0, common_1.Patch)('users/:id/ban'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "toggleBanUser", null);
__decorate([
    (0, common_1.Delete)('users/:id'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteUser", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('api/admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map