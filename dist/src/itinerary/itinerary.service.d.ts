import { PrismaService } from '../prisma/prisma.service';
interface ItineraryParams {
    startLat: number;
    startLng: number;
    endLat: number;
    endLng: number;
    duration: number;
}
export interface ItineraryStop {
    order: number;
    restaurantId: string;
    restaurantName: string;
    address: string;
    latitude: number;
    longitude: number;
    distanceFromPrev: number;
    travelTimeMinutes: number;
    diningTimeMinutes: number;
    arrivalTimeMinutes: number;
    arrivalTimeLabel: string;
    isPromoActive: boolean;
    discountDisplay: string | null;
    recommendedMenus: {
        id: string;
        name: string;
        description: string;
        price: number;
        image: string;
    }[];
}
export declare class ItineraryService {
    private prisma;
    constructor(prisma: PrismaService);
    private haversineKm;
    private travelMinutes;
    private formatArrivalLabel;
    private getCurrentWIBTime;
    buildItinerary(params: ItineraryParams): Promise<ItineraryStop[]>;
}
export {};
