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
exports.ItineraryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ItineraryService = class ItineraryService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    haversineKm(lat1, lng1, lat2, lng2) {
        const R = 6371;
        const toRad = (deg) => (deg * Math.PI) / 180;
        const dLat = toRad(lat2 - lat1);
        const dLng = toRad(lng2 - lng1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) *
                Math.cos(toRad(lat2)) *
                Math.sin(dLng / 2) *
                Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    travelMinutes(distanceKm) {
        const AVG_SPEED_KMH = 30;
        return (distanceKm / AVG_SPEED_KMH) * 60;
    }
    formatArrivalLabel(totalMinutes) {
        const hours = Math.floor(totalMinutes / 60);
        const mins = Math.round(totalMinutes % 60);
        if (hours === 0)
            return `${mins} menit dari start`;
        if (mins === 0)
            return `${hours} jam dari start`;
        return `${hours} jam ${mins} menit dari start`;
    }
    getCurrentWIBTime() {
        const now = new Date();
        const wibOffset = 7 * 60;
        const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
        const wibMinutes = (utcMinutes + wibOffset) % (24 * 60);
        const h = Math.floor(wibMinutes / 60);
        const m = wibMinutes % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }
    async buildItinerary(params) {
        const { startLat, startLng, duration } = params;
        const DINING_TIME_MINUTES = 60;
        const durationMinutes = duration * 60;
        const allRestaurants = await this.prisma.restaurant.findMany({
            where: {
                owner: { status: 'ACTIVE' },
            },
            include: {
                menus: {
                    orderBy: { price: 'asc' },
                    take: 5,
                },
                promos: true,
            },
        });
        if (allRestaurants.length === 0) {
            return [];
        }
        const currentTime = this.getCurrentWIBTime();
        let currentLat = startLat;
        let currentLng = startLng;
        const visited = new Set();
        const itinerary = [];
        let accumulatedMinutes = 0;
        while (true) {
            const candidates = allRestaurants.filter((r) => !visited.has(r.id));
            if (candidates.length === 0)
                break;
            const withDistance = candidates.map((r) => ({
                restaurant: r,
                distanceKm: this.haversineKm(currentLat, currentLng, r.latitude, r.longitude),
            }));
            withDistance.sort((a, b) => a.distanceKm - b.distanceKm);
            const nearest = withDistance[0];
            const travelMins = this.travelMinutes(nearest.distanceKm);
            const timeNeeded = travelMins + DINING_TIME_MINUTES;
            if (accumulatedMinutes + timeNeeded > durationMinutes) {
                break;
            }
            accumulatedMinutes += timeNeeded;
            const r = nearest.restaurant;
            let isPromoActive = false;
            let discountDisplay = null;
            for (const promo of r.promos) {
                if (currentTime >= promo.startHour && currentTime <= promo.endHour) {
                    isPromoActive = true;
                    discountDisplay = `${promo.discount}%`;
                    break;
                }
            }
            const arrivalMinutes = accumulatedMinutes - DINING_TIME_MINUTES;
            const stop = {
                order: itinerary.length + 1,
                restaurantId: r.id,
                restaurantName: r.name,
                address: r.address,
                latitude: r.latitude,
                longitude: r.longitude,
                distanceFromPrev: parseFloat(nearest.distanceKm.toFixed(2)),
                travelTimeMinutes: parseFloat(travelMins.toFixed(1)),
                diningTimeMinutes: DINING_TIME_MINUTES,
                arrivalTimeMinutes: parseFloat(arrivalMinutes.toFixed(1)),
                arrivalTimeLabel: this.formatArrivalLabel(arrivalMinutes),
                isPromoActive,
                discountDisplay,
                recommendedMenus: r.menus.map((m) => ({
                    id: m.id,
                    name: m.name,
                    description: m.description,
                    price: m.price,
                    image: m.image,
                })),
            };
            itinerary.push(stop);
            visited.add(r.id);
            currentLat = r.latitude;
            currentLng = r.longitude;
        }
        return itinerary;
    }
};
exports.ItineraryService = ItineraryService;
exports.ItineraryService = ItineraryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ItineraryService);
//# sourceMappingURL=itinerary.service.js.map