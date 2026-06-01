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
exports.ItineraryController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const itinerary_service_1 = require("./itinerary.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
let ItineraryController = class ItineraryController {
    itineraryService;
    constructor(itineraryService) {
        this.itineraryService = itineraryService;
    }
    async getItinerary(startLat, startLng, endLat, endLng, duration) {
        const params = {
            startLat: parseFloat(startLat) || 0,
            startLng: parseFloat(startLng) || 0,
            endLat: parseFloat(endLat) || 0,
            endLng: parseFloat(endLng) || 0,
            duration: Number(duration) || 0,
        };
        const itinerary = await this.itineraryService.buildItinerary(params);
        return {
            success: true,
            message: itinerary.length > 0
                ? `Rute wisata kuliner dengan ${itinerary.length} destinasi berhasil disusun`
                : 'Durasi terlalu singkat untuk menyusun rute. Coba tambah durasi perjalanan.',
            meta: {
                totalStops: itinerary.length,
                durationHours: params.duration,
                startCoordinate: { lat: params.startLat, lng: params.startLng },
                endCoordinate: { lat: params.endLat, lng: params.endLng },
            },
            data: itinerary,
        };
    }
};
exports.ItineraryController = ItineraryController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.USER),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)('startLat')),
    __param(1, (0, common_1.Query)('startLng')),
    __param(2, (0, common_1.Query)('endLat')),
    __param(3, (0, common_1.Query)('endLng')),
    __param(4, (0, common_1.Query)('duration')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], ItineraryController.prototype, "getItinerary", null);
exports.ItineraryController = ItineraryController = __decorate([
    (0, common_1.Controller)('api/itinerary'),
    __metadata("design:paramtypes", [itinerary_service_1.ItineraryService])
], ItineraryController);
//# sourceMappingURL=itinerary.controller.js.map