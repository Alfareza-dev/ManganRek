import { RestaurantsService } from './restaurants.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { CreatePromoDto } from './dto/create-promo.dto';
import { UpdatePromoDto } from './dto/update-promo.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import type { Request } from 'express';
export declare class RestaurantsController {
    private readonly restaurantsService;
    constructor(restaurantsService: RestaurantsService);
    getProfile(req: Request): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            ownerId: string;
            name: string;
            address: string;
            latitude: number;
            longitude: number;
            legalPhoto: string;
            createdAt: Date;
            updatedAt: Date;
            category: string | null;
            openingHours: string | null;
            branches: string | null;
            googleMapsUrl: string | null;
            description: string | null;
            isOpen: boolean | null;
        };
    }>;
    updateProfile(req: Request, dto: UpdateRestaurantDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            ownerId: string;
            name: string;
            address: string;
            latitude: number;
            longitude: number;
            legalPhoto: string;
            createdAt: Date;
            updatedAt: Date;
            category: string | null;
            openingHours: string | null;
            branches: string | null;
            googleMapsUrl: string | null;
            description: string | null;
            isOpen: boolean | null;
        };
    }>;
    getRevenue(req: Request): Promise<{
        success: boolean;
        message: string;
        data: {
            totalOrderRevenue: number;
            totalVoucherRevenue: number;
            totalRevenue: number;
            totalDaily: number;
            totalTransactions: number;
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
                    orderId: string;
                    menuId: string;
                    quantity: number;
                })[];
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                restaurantId: string;
                status: import("@prisma/client").$Enums.OrderStatus;
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
                    restaurantId: string;
                    title: string;
                    price: number;
                    value: number;
                    stock: number;
                    expiryDate: Date;
                    isDeleted: boolean;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                status: import("@prisma/client").$Enums.VoucherStatus;
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
            id: string;
            name: string;
            createdAt: Date;
            description: string;
            restaurantId: string;
            price: number;
            isDeleted: boolean;
            image: string;
            isAvailable: boolean;
        };
    }>;
    updateMenu(req: Request, id: string, dto: UpdateMenuDto, file?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            name: string;
            createdAt: Date;
            description: string;
            restaurantId: string;
            price: number;
            isDeleted: boolean;
            image: string;
            isAvailable: boolean;
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
                id: string;
                name: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            restaurantId: string;
            discount: number;
            type: import("@prisma/client").$Enums.PromoType;
            startHour: string;
            endHour: string;
        })[];
    }>;
    getPromo(req: Request, id: string): Promise<{
        success: boolean;
        message: string;
        data: {
            menus: {
                id: string;
                name: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            restaurantId: string;
            discount: number;
            type: import("@prisma/client").$Enums.PromoType;
            startHour: string;
            endHour: string;
        };
    }>;
    createPromo(req: Request, dto: CreatePromoDto): Promise<{
        success: boolean;
        message: string;
        data: {
            menus: {
                id: string;
                name: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            restaurantId: string;
            discount: number;
            type: import("@prisma/client").$Enums.PromoType;
            startHour: string;
            endHour: string;
        };
    }>;
    updatePromo(req: Request, id: string, dto: UpdatePromoDto): Promise<{
        success: boolean;
        message: string;
        data: {
            menus: {
                id: string;
                name: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            restaurantId: string;
            discount: number;
            type: import("@prisma/client").$Enums.PromoType;
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
    getAllVouchersPublic(page?: string, limit?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            vouchers: ({
                restaurant: {
                    id: string;
                    name: string;
                    address: string;
                };
            } & {
                id: string;
                createdAt: Date;
                restaurantId: string;
                title: string;
                price: number;
                value: number;
                stock: number;
                expiryDate: Date;
                isDeleted: boolean;
            })[];
            pagination: {
                page: number;
                limit: number;
                total: number;
                totalPages: number;
            };
        };
    }>;
    getAllPromosPublic(page?: string, limit?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            promos: {
                isActive: boolean;
                menus: {
                    id: string;
                    name: string;
                    price: number;
                    image: string;
                }[];
                restaurant: {
                    id: string;
                    name: string;
                    address: string;
                };
                id: string;
                createdAt: Date;
                restaurantId: string;
                discount: number;
                type: import("@prisma/client").$Enums.PromoType;
                startHour: string;
                endHour: string;
            }[];
            pagination: {
                page: number;
                limit: number;
                total: number;
                totalPages: number;
            };
        };
    }>;
    findAll(page?: string, limit?: string, search?: string, lat?: string, lng?: string, sort?: string): Promise<{
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
            id: string;
            ownerId: string;
            name: string;
            address: string;
            latitude: number;
            longitude: number;
            legalPhoto: string;
            createdAt: Date;
            updatedAt: Date;
            category: string | null;
            openingHours: string | null;
            branches: string | null;
            googleMapsUrl: string | null;
            description: string | null;
            isOpen: boolean | null;
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
    getVouchersPublic(id: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            createdAt: Date;
            restaurantId: string;
            title: string;
            price: number;
            value: number;
            stock: number;
            expiryDate: Date;
            isDeleted: boolean;
        }[];
    }>;
    getVoucherDetailPublic(id: string, voucherId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            restaurant: {
                name: string;
                address: string;
            };
        } & {
            id: string;
            createdAt: Date;
            restaurantId: string;
            title: string;
            price: number;
            value: number;
            stock: number;
            expiryDate: Date;
            isDeleted: boolean;
        };
    }>;
    getPromosPublic(id: string): Promise<{
        success: boolean;
        message: string;
        data: {
            isActive: boolean;
            menus: {
                id: string;
                name: string;
                price: number;
                image: string;
            }[];
            id: string;
            createdAt: Date;
            restaurantId: string;
            discount: number;
            type: import("@prisma/client").$Enums.PromoType;
            startHour: string;
            endHour: string;
        }[];
    }>;
    getPromoDetailPublic(id: string, promoId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            isActive: boolean;
            menus: {
                id: string;
                name: string;
                price: number;
                image: string;
            }[];
            id: string;
            createdAt: Date;
            restaurantId: string;
            discount: number;
            type: import("@prisma/client").$Enums.PromoType;
            startHour: string;
            endHour: string;
        };
    }>;
}
