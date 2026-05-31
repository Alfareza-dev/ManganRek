import { RestaurantsService } from './restaurants.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { CreatePromoDto } from './dto/create-promo.dto';
import { UpdatePromoDto } from './dto/update-promo.dto';
import type { Request } from 'express';
export declare class RestaurantsController {
    private readonly restaurantsService;
    constructor(restaurantsService: RestaurantsService);
    findAll(page?: string, limit?: string, lat?: string, lng?: string, sort?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            restaurants: any[];
            pagination: {
                page: number;
                limit: number;
                total: number;
                totalPages: number;
            };
        };
    }>;
    createMenu(req: Request, dto: CreateMenuDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            name: string;
            createdAt: Date;
            description: string;
            price: number;
            image: string;
            isAvailable: boolean;
            restaurantId: string;
        };
    }>;
    updateMenu(req: Request, id: string, dto: UpdateMenuDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            name: string;
            createdAt: Date;
            description: string;
            price: number;
            image: string;
            isAvailable: boolean;
            restaurantId: string;
        };
    }>;
    deleteMenu(req: Request, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    createPromo(req: Request, dto: CreatePromoDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            restaurantId: string;
            discount: number;
            startHour: string;
            endHour: string;
        };
    }>;
    updatePromo(req: Request, id: string, dto: UpdatePromoDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            restaurantId: string;
            discount: number;
            startHour: string;
            endHour: string;
        };
    }>;
    deletePromo(req: Request, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
