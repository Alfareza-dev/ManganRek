import { ItineraryService } from './itinerary.service';
export declare class ItineraryController {
    private readonly itineraryService;
    constructor(itineraryService: ItineraryService);
    getItinerary(startLat: string, startLng: string, endLat: string, endLng: string, duration: string): Promise<{
        success: boolean;
        message: string;
        meta: {
            totalStops: number;
            durationHours: number;
            startCoordinate: {
                lat: number;
                lng: number;
            };
            endCoordinate: {
                lat: number;
                lng: number;
            };
        };
        data: import("./itinerary.service").ItineraryStop[];
    }>;
}
