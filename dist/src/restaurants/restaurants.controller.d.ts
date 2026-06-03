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
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            ownerId: string;
            address: string;
            latitude: number;
            longitude: number;
            legalPhoto: string;
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
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            ownerId: string;
            address: string;
            latitude: number;
            longitude: number;
            legalPhoto: string;
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
                    menuId: string;
                    quantity: number;
                    orderId: string;
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
                    isDeleted: boolean;
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
            isDeleted: boolean;
            createdAt: Date;
            description: string;
            price: number;
            image: string;
            isAvailable: boolean;
            restaurantId: string;
        };
    }>;
    updateMenu(req: Request, id: string, dto: UpdateMenuDto, file?: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        data: {
            name: string;
            id: string;
            isDeleted: boolean;
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
    getAllVouchersPublic(page?: string, limit?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            vouchers: ({
                restaurant: {
                    name: string;
                    id: string;
                    address: string;
                };
            } & {
                id: string;
                isDeleted: boolean;
                createdAt: Date;
                value: number;
                price: number;
                title: string;
                restaurantId: string;
                stock: number;
                expiryDate: Date;
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
                restaurant: {
                    name: string;
                    id: string;
                    address: string;
                };
                menus: {
                    name: string;
                    id: string;
                    price: number;
                    image: string;
                }[];
                id: string;
                createdAt: Date;
                type: import("@prisma/client").$Enums.PromoType;
                restaurantId: string;
                discount: number;
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
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            ownerId: string;
            address: string;
            latitude: number;
            longitude: number;
            legalPhoto: string;
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
            isDeleted: boolean;
            createdAt: Date;
            value: number;
            price: number;
            title: string;
            restaurantId: string;
            stock: number;
            expiryDate: Date;
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
            isDeleted: boolean;
            createdAt: Date;
            value: number;
            price: number;
            title: string;
            restaurantId: string;
            stock: number;
            expiryDate: Date;
        };
    }>;
    getPromosPublic(id: string): Promise<{
        success: boolean;
        message: string;
        data: {
            isActive: boolean;
            menus: {
                name: string;
                id: string;
                price: number;
                image: string;
            }[];
            id: string;
            createdAt: Date;
            type: import("@prisma/client").$Enums.PromoType;
            restaurantId: string;
            discount: number;
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
                name: string;
                id: string;
                price: number;
                image: string;
            }[];
            id: string;
            createdAt: Date;
            type: import("@prisma/client").$Enums.PromoType;
            restaurantId: string;
            discount: number;
            startHour: string;
            endHour: string;
        };
    }>;
}
