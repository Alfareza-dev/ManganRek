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
exports.UsersController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const create_cashier_dto_1 = require("./dto/create-cashier.dto");
const update_cashier_dto_1 = require("./dto/update-cashier.dto");
const update_cashier_password_dto_1 = require("./dto/update-cashier-password.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    async createCashier(req, dto) {
        const user = req.user;
        const data = await this.usersService.createCashier(user.userId, dto);
        return {
            success: true,
            message: 'Akun kasir berhasil dibuat',
            data
        };
    }
    async getCashiers(req) {
        const user = req.user;
        const data = await this.usersService.getCashiers(user.userId);
        return { success: true, message: 'Berhasil mengambil daftar kasir', data };
    }
    async getCashierById(req, id) {
        const user = req.user;
        const data = await this.usersService.getCashierById(user.userId, id);
        return { success: true, message: 'Berhasil mengambil detail kasir', data };
    }
    async updateCashier(req, id, dto) {
        const user = req.user;
        const data = await this.usersService.updateCashier(user.userId, id, dto);
        return { success: true, message: 'Data kasir berhasil diperbarui', data };
    }
    async updateCashierPassword(req, id, dto) {
        const user = req.user;
        const data = await this.usersService.updateCashierPassword(user.userId, id, dto.password);
        return { success: true, message: data.message };
    }
    async deleteCashier(req, id) {
        const user = req.user;
        const data = await this.usersService.deleteCashier(user.userId, id);
        return { success: true, message: data.message };
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)('cashier'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN_RESTO),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_cashier_dto_1.CreateCashierDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createCashier", null);
__decorate([
    (0, common_1.Get)('cashiers'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN_RESTO),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getCashiers", null);
__decorate([
    (0, common_1.Get)('cashiers/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN_RESTO),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getCashierById", null);
__decorate([
    (0, common_1.Put)('cashiers/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN_RESTO),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_cashier_dto_1.UpdateCashierDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateCashier", null);
__decorate([
    (0, common_1.Patch)('cashiers/:id/password'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN_RESTO),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_cashier_password_dto_1.UpdateCashierPasswordDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateCashierPassword", null);
__decorate([
    (0, common_1.Delete)('cashiers/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN_RESTO),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteCashier", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('api/users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map