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
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const restaurants_service_1 = require("./restaurants.service");
const create_menu_dto_1 = require("./dto/create-menu.dto");
const update_menu_dto_1 = require("./dto/update-menu.dto");
const create_promo_dto_1 = require("./dto/create-promo.dto");
const update_promo_dto_1 = require("./dto/update-promo.dto");
const update_restaurant_dto_1 = require("./dto/update-restaurant.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let RestaurantsController = class RestaurantsController {
    restaurantsService;
    constructor(restaurantsService) {
        this.restaurantsService = restaurantsService;
    }
    async getProfile(req) {
        const user = req.user;
        const data = await this.restaurantsService.getProfile(user.userId);
        return { success: true, message: 'Profil restoran berhasil dimuat', data };
    }
    async updateProfile(req, dto) {
        const user = req.user;
        const data = await this.restaurantsService.updateProfile(user.userId, dto);
        return { success: true, message: 'Profil restoran berhasil diperbarui', data };
    }
    async getRevenue(req) {
        const user = req.user;
        const data = await this.restaurantsService.getRevenue(user.userId);
        return { success: true, message: 'Ringkasan pendapatan restoran berhasil dimuat', data };
    }
    async getOrdersHistory(req) {
        const user = req.user;
        const data = await this.restaurantsService.getOrdersHistory(user.userId);
        return { success: true, message: 'Riwayat transaksi berhasil dimuat', data };
    }
    async getAllMenus(req) {
        const user = req.user;
        const data = await this.restaurantsService.getAllMenus(user.userId);
        return { success: true, message: 'Daftar menu berhasil dimuat', data };
    }
    async getMenu(req, id) {
        const user = req.user;
        const data = await this.restaurantsService.getMenu(user.userId, id);
        return { success: true, message: 'Detail menu berhasil dimuat', data };
    }
    async createMenu(req, dto, file) {
        if (!file) {
            throw new common_1.BadRequestException('Gambar menu wajib diunggah');
        }
        const user = req.user;
        const data = await this.restaurantsService.createMenu(user.userId, dto, file);
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
    async getAllPromos(req) {
        const user = req.user;
        const data = await this.restaurantsService.getAllPromos(user.userId);
        return { success: true, message: 'Daftar promo berhasil dimuat', data };
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
    async getAllMenusPublic(page, limit, search) {
        const data = await this.restaurantsService.getAllMenusPublicWithPagination({
            page,
            limit,
            search,
        });
        return {
            success: true,
            message: 'Daftar semua menu berhasil dimuat',
            data,
        };
    }
    async getAllVouchersPublic(page, limit) {
        const data = await this.restaurantsService.getAllVouchersPublic({
            page,
            limit,
        });
        return {
            success: true,
            message: 'Daftar semua voucher berhasil dimuat',
            data,
        };
    }
    async getAllPromosPublic(page, limit) {
        const data = await this.restaurantsService.getAllPromosPublic({
            page,
            limit,
        });
        return {
            success: true,
            message: 'Daftar semua promo berhasil dimuat',
            data,
        };
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
    async getVouchersPublic(id) {
        const data = await this.restaurantsService.getVouchersPublic(id);
        return { success: true, message: 'Daftar voucher restoran berhasil dimuat', data };
    }
    async getVoucherDetailPublic(id, voucherId) {
        const data = await this.restaurantsService.getVoucherDetailPublic(id, voucherId);
        return { success: true, message: 'Detail voucher berhasil dimuat', data };
    }
    async getPromosPublic(id) {
        const data = await this.restaurantsService.getPromosPublic(id);
        return { success: true, message: 'Daftar promo restoran berhasil dimuat', data };
    }
    async getPromoDetailPublic(id, promoId) {
        const data = await this.restaurantsService.getPromoDetailPublic(id, promoId);
        return { success: true, message: 'Detail promo berhasil dimuat', data };
    }
};
exports.RestaurantsController = RestaurantsController;
__decorate([
    (0, common_1.Get)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN_RESTO),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Put)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN_RESTO),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_restaurant_dto_1.UpdateRestaurantDto]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Get)('revenue'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN_RESTO),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "getRevenue", null);
__decorate([
    (0, common_1.Get)('orders/history'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN_RESTO),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "getOrdersHistory", null);
__decorate([
    (0, common_1.Get)('menus'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN_RESTO),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "getAllMenus", null);
__decorate([
    (0, common_1.Get)('menus/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN_RESTO),
    openapi.ApiResponse({ status: 200 }),
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
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        description: 'Tambah menu baru dengan upload gambar',
        type: create_menu_dto_1.CreateMenuDto,
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_menu_dto_1.CreateMenuDto, Object]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "createMenu", null);
__decorate([
    (0, common_1.Put)('menus/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN_RESTO),
    openapi.ApiResponse({ status: 200 }),
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
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "deleteMenu", null);
__decorate([
    (0, common_1.Get)('promos'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN_RESTO),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "getAllPromos", null);
__decorate([
    (0, common_1.Get)('promos/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.ADMIN_RESTO),
    openapi.ApiResponse({ status: 200 }),
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
    openapi.ApiResponse({ status: 201 }),
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
    openapi.ApiResponse({ status: 200 }),
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
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "deletePromo", null);
__decorate([
    openapi.ApiQuery({ name: "page", required: false }),
    openapi.ApiQuery({ name: "limit", required: false }),
    openapi.ApiQuery({ name: "search", required: false }),
    (0, common_1.Get)('all-menus'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "getAllMenusPublic", null);
__decorate([
    openapi.ApiQuery({ name: "page", required: false }),
    openapi.ApiQuery({ name: "limit", required: false }),
    (0, common_1.Get)('all-vouchers'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "getAllVouchersPublic", null);
__decorate([
    openapi.ApiQuery({ name: "page", required: false }),
    openapi.ApiQuery({ name: "limit", required: false }),
    (0, common_1.Get)('all-promos'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "getAllPromosPublic", null);
__decorate([
    openapi.ApiQuery({ name: "page", required: false }),
    openapi.ApiQuery({ name: "limit", required: false }),
    openapi.ApiQuery({ name: "lat", required: false }),
    openapi.ApiQuery({ name: "lng", required: false }),
    openapi.ApiQuery({ name: "sort", required: false }),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200 }),
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
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/menus'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "getMenus", null);
__decorate([
    (0, common_1.Get)(':id/menus/:menuId'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('menuId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "getMenuDetail", null);
__decorate([
    (0, common_1.Get)(':id/vouchers'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "getVouchersPublic", null);
__decorate([
    (0, common_1.Get)(':id/vouchers/:voucherId'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('voucherId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "getVoucherDetailPublic", null);
__decorate([
    (0, common_1.Get)(':id/promos'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "getPromosPublic", null);
__decorate([
    (0, common_1.Get)(':id/promos/:promoId'),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('promoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "getPromoDetailPublic", null);
exports.RestaurantsController = RestaurantsController = __decorate([
    (0, common_1.Controller)('api/restaurants'),
    __metadata("design:paramtypes", [restaurants_service_1.RestaurantsService])
], RestaurantsController);
//# sourceMappingURL=restaurants.controller.js.map