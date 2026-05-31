import { PrismaService } from '../prisma/prisma.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { CreatePromoDto } from './dto/create-promo.dto';
import { UpdatePromoDto } from './dto/update-promo.dto';
export declare class RestaurantsService {
    private prisma;
    constructor(prisma: PrismaService);
    private getOwnedRestaurant;
    createMenu(userId: string, dto: CreateMenuDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        description: string;
        price: number;
        image: string;
        isAvailable: boolean;
        restaurantId: string;
    }>;
    getMenu(userId: string, menuId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        description: string;
        price: number;
        image: string;
        isAvailable: boolean;
        restaurantId: string;
    }>;
    updateMenu(userId: string, menuId: string, dto: UpdateMenuDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        description: string;
        price: number;
        image: string;
        isAvailable: boolean;
        restaurantId: string;
    }>;
    deleteMenu(userId: string, menuId: string): Promise<{
        deleted: boolean;
    }>;
    createPromo(userId: string, dto: CreatePromoDto): Promise<{
        id: string;
        restaurantId: string;
        discount: number;
        startHour: string;
        endHour: string;
    }>;
    getPromo(userId: string, promoId: string): Promise<{
        id: string;
        restaurantId: string;
        discount: number;
        startHour: string;
        endHour: string;
    }>;
    updatePromo(userId: string, promoId: string, dto: UpdatePromoDto): Promise<{
        id: string;
        restaurantId: string;
        discount: number;
        startHour: string;
        endHour: string;
    }>;
    deletePromo(userId: string, promoId: string): Promise<{
        deleted: boolean;
    }>;
    findAllPublic(query: {
        page?: string;
        limit?: string;
        lat?: string;
        lng?: string;
        sort?: string;
    }): Promise<{
        restaurants: any[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOnePublic(id: string): Promise<{
        owner: {
            name: string;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
        address: string;
        latitude: number;
        longitude: number;
        legalPhoto: string;
    }>;
    getMenusPublic(restaurantId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        description: string;
        price: number;
        image: string;
        isAvailable: boolean;
        restaurantId: string;
    }[]>;
    getMenuDetailPublic(restaurantId: string, menuId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        description: string;
        price: number;
        image: string;
        isAvailable: boolean;
        restaurantId: string;
    }>;
}
