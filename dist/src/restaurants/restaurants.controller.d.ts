import { RestaurantsService } from './restaurants.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { CreatePromoDto } from './dto/create-promo.dto';
import { UpdatePromoDto } from './dto/update-promo.dto';
import type { Request } from 'express';
export declare class RestaurantsController {
    private readonly restaurantsService;
    constructor(restaurantsService: RestaurantsService);
    getRevenue(req: Request): Promise<{
        success: boolean;
        message: string;
        data: {
            totalOrderRevenue: number;
            totalVoucherRevenue: number;
            grandTotal: number;
        };
    }>;
    getOrdersHistory(req: Request): Promise<{
        success: boolean;
        message: string;
        data: {
            orders: ({
                cashier: {
                    name: string;
                };
                items: ({
                    menu: {
                        name: string;
                    };
                } & {
                    id: string;
                    createdAt: Date;
                    price: number;
                    menuId: string;
                    orderId: string;
                    quantity: number;
                })[];
            } & {
                id: string;
                status: import("@prisma/client").$Enums.OrderStatus;
                createdAt: Date;
                updatedAt: Date;
                restaurantId: string;
                finalAmount: number;
                totalAmount: number;
                discount: number;
                cashierId: string;
                customerName: string | null;
                paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
            })[];
            vouchers: ({
                user: {
                    name: string;
                };
                voucher: {
                    id: string;
                    createdAt: Date;
                    value: number;
                    price: number;
                    title: string;
                    restaurantId: string;
                    stock: number;
                    expiryDate: Date;
                };
            } & {
                id: string;
                status: import("@prisma/client").$Enums.VoucherStatus;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                voucherId: string;
                uniqueCode: string | null;
                totalPaid: number;
                platformFee: number;
                paymentUrl: string | null;
            })[];
        };
    }>;
    getAllMenus(req: Request): Promise<{
        success: boolean;
        message: string;
        data: any[];
    }>;
    getMenu(req: Request, id: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    createMenu(req: Request, dto: CreateMenuDto, file: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        data: {
            name: string;
            id: string;
            createdAt: Date;
            price: number;
            description: string;
            image: string;
            isAvailable: boolean;
            restaurantId: string;
        };
    }>;
    updateMenu(req: Request, id: string, dto: UpdateMenuDto): Promise<{
        success: boolean;
        message: string;
        data: {
            name: string;
            id: string;
            createdAt: Date;
            price: number;
            description: string;
            image: string;
            isAvailable: boolean;
            restaurantId: string;
        };
    }>;
    deleteMenu(req: Request, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getAllPromos(req: Request): Promise<{
        success: boolean;
        message: string;
        data: ({
            menus: {
                name: string;
                id: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            type: import("@prisma/client").$Enums.PromoType;
            restaurantId: string;
            discount: number;
            startHour: string;
            endHour: string;
        })[];
    }>;
    getPromo(req: Request, id: string): Promise<{
        success: boolean;
        message: string;
        data: {
            menus: {
                name: string;
                id: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            type: import("@prisma/client").$Enums.PromoType;
            restaurantId: string;
            discount: number;
            startHour: string;
            endHour: string;
        };
    }>;
    createPromo(req: Request, dto: CreatePromoDto): Promise<{
        success: boolean;
        message: string;
        data: {
            menus: {
                name: string;
                id: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            type: import("@prisma/client").$Enums.PromoType;
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
            menus: {
                name: string;
                id: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            type: import("@prisma/client").$Enums.PromoType;
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
    getAllMenusPublic(page?: string, limit?: string, search?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            menus: any[];
            pagination: {
                page: number;
                limit: number;
                total: number;
            };
        };
    }>;
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
    findOne(id: string): Promise<{
        success: boolean;
        message: string;
        data: {
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
        };
    }>;
    getMenus(id: string): Promise<{
        success: boolean;
        message: string;
        data: any[];
    }>;
    getMenuDetail(id: string, menuId: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
}
