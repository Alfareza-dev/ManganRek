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
exports.RestaurantsController = void 0;
const common_1 = require("@nestjs/common");
const restaurants_service_1 = require("./restaurants.service");
const create_menu_dto_1 = require("./dto/create-menu.dto");
const update_menu_dto_1 = require("./dto/update-menu.dto");
const create_promo_dto_1 = require("./dto/create-promo.dto");
const update_promo_dto_1 = require("./dto/update-promo.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let RestaurantsController = class RestaurantsController {
    restaurantsService;
    constructor(restaurantsService) {
        this.restaurantsService = restaurantsService;
    }
    async findAll(page, limit, lat, lng, sort) {
        const data = await this.restaurantsService.findAllPublic({
            page,
            limit,
            lat,
            lng,
            sort,
        });
        return {
            success: true,
            message: 'Daftar restoran berhasil dimuat',
            data,
        };
    }
    async findOne(id) {
        const data = await this.restaurantsService.findOnePublic(id);
        return { success: true, message: 'Detail restoran berhasil dimuat', data };
    }
    async getMenus(id) {
        const data = await this.restaurantsService.getMenusPublic(id);
        return { success: true, message: 'Daftar menu berhasil dimuat', data };
    }
    async getMenuDetail(id, menuId) {
        const data = await this.restaurantsService.getMenuDetailPublic(id, menuId);
        return { success: true, message: 'Detail menu berhasil dimuat', data };
    }
    async getMenu(req, id) {
        const user = req.user;
        const data = await this.restaurantsService.getMenu(user.userId, id);
        return { success: true, message: 'Detail menu berhasil dimuat', data };
    }
    async createMenu(req, dto) {
        const user = req.user;
        const data = await this.restaurantsService.createMenu(user.userId, dto);
        return {
            success: true,
            message: 'Menu berhasil ditambahkan',
            data,
        };
    }
    async updateMenu(req, id, dto) {
        const user = req.user;
        const data = await this.restaurantsService.updateMenu(user.userId, id, dto);
        return {
            success: true,
            message: 'Menu berhasil diperbarui',
            data,
        };
    }
    async deleteMenu(req, id) {
        const user = req.user;
        await this.restaurantsService.deleteMenu(user.userId, id);
        return {
            success: true,
            message: 'Menu berhasil dihapus',
        };
    }
    async getPromo(req, id) {
        const user = req.user;
        const data = await this.restaurantsService.getPromo(user.userId, id);
        return { success: true, message: 'Detail promo berhasil dimuat', data };
    }
    async createPromo(req, dto) {
        const user = req.user;
        const data = await this.restaurantsService.createPromo(user.userId, dto);
        return {
            success: true,
            message: 'Promo berhasil ditambahkan',
            data,
        };
    }
    async updatePromo(req, id, dto) {
        const user = req.user;
        const data = await this.restaurantsService.updatePromo(user.userId, id, dto);
        return {
            success: true,
            message: 'Promo berhasil diperbarui',
            data,
        };
    }
    async deletePromo(req, id) {
        const user = req.user;
        await this.restaurantsService.deletePromo(user.userId, id);
        return {
            success: true,
            message: 'Promo berhasil dihapus',
        };
    }
};
exports.RestaurantsController = RestaurantsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('lat')),
    __param(3, (0, common_1.Query)('lng')),
    __param(4, (0, common_1.Query)('sort')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/menus'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "getMenus", null);
__decorate([
    (0, common_1.Get)(':id/menus/:menuId'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('menuId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "getMenuDetail", null);
__decorate([
    (0, common_1.Get)('menus/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN_RESTO),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "getMenu", null);
__decorate([
    (0, common_1.Post)('menus'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN_RESTO),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_menu_dto_1.CreateMenuDto]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "createMenu", null);
__decorate([
    (0, common_1.Put)('menus/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN_RESTO),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_menu_dto_1.UpdateMenuDto]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "updateMenu", null);
__decorate([
    (0, common_1.Delete)('menus/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN_RESTO),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "deleteMenu", null);
__decorate([
    (0, common_1.Get)('promos/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN_RESTO),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "getPromo", null);
__decorate([
    (0, common_1.Post)('promos'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN_RESTO),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_promo_dto_1.CreatePromoDto]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "createPromo", null);
__decorate([
    (0, common_1.Put)('promos/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN_RESTO),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_promo_dto_1.UpdatePromoDto]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "updatePromo", null);
__decorate([
    (0, common_1.Delete)('promos/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN_RESTO),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "deletePromo", null);
exports.RestaurantsController = RestaurantsController = __decorate([
    (0, common_1.Controller)('api/restaurants'),
    __metadata("design:paramtypes", [restaurants_service_1.RestaurantsService])
], RestaurantsController);
//# sourceMappingURL=restaurants.controller.js.map