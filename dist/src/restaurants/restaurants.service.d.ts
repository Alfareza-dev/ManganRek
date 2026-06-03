import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { CreatePromoDto } from './dto/create-promo.dto';
import { UpdatePromoDto } from './dto/update-promo.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
export declare class RestaurantsService {
    private prisma;
    private cloudinaryService;
    constructor(prisma: PrismaService, cloudinaryService: CloudinaryService);
    private getOwnedRestaurant;
    getProfile(userId: string): Promise<{
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
    }>;
    updateProfile(userId: string, dto: UpdateRestaurantDto): Promise<{
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
    }>;
    getRevenue(userId: string): Promise<{
        totalOrderRevenue: number;
        totalVoucherRevenue: number;
        totalRevenue: number;
        totalDaily: number;
        totalTransactions: number;
    }>;
    getOrdersHistory(userId: string): Promise<{
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
    }>;
    getAllMenus(userId: string): Promise<any[]>;
    createMenu(userId: string, dto: CreateMenuDto, file: Express.Multer.File): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        description: string;
        restaurantId: string;
        price: number;
        isDeleted: boolean;
        image: string;
        isAvailable: boolean;
    }>;
    getMenu(userId: string, menuId: string): Promise<any>;
    updateMenu(userId: string, menuId: string, dto: UpdateMenuDto, file?: Express.Multer.File): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        description: string;
        restaurantId: string;
        price: number;
        isDeleted: boolean;
        image: string;
        isAvailable: boolean;
    }>;
    deleteMenu(userId: string, menuId: string): Promise<{
        deleted: boolean;
    }>;
    getAllPromos(userId: string): Promise<({
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
    })[]>;
    createPromo(userId: string, dto: CreatePromoDto): Promise<{
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
    }>;
    getPromo(userId: string, promoId: string): Promise<{
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
    }>;
    updatePromo(userId: string, promoId: string, dto: UpdatePromoDto): Promise<{
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
    }>;
    deletePromo(userId: string, promoId: string): Promise<{
        deleted: boolean;
    }>;
    findAllPublic(query: {
        page?: string;
        limit?: string;
        search?: string;
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
    }>;
    getMenusPublic(restaurantId: string): Promise<any[]>;
    getMenuDetailPublic(restaurantId: string, menuId: string): Promise<any>;
    getVouchersPublic(restaurantId: string): Promise<{
        id: string;
        createdAt: Date;
        restaurantId: string;
        title: string;
        price: number;
        value: number;
        stock: number;
        expiryDate: Date;
        isDeleted: boolean;
    }[]>;
    getVoucherDetailPublic(restaurantId: string, voucherId: string): Promise<{
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
    }>;
    getPromosPublic(restaurantId: string): Promise<{
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
    }[]>;
    getPromoDetailPublic(restaurantId: string, promoId: string): Promise<{
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
    }>;
    getAllMenusPublicWithPagination(query: {
        page?: string;
        limit?: string;
        search?: string;
    }): Promise<{
        menus: any[];
        pagination: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    getAllVouchersPublic(query: {
        page?: string;
        limit?: string;
    }): Promise<{
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
    }>;
    getAllPromosPublic(query: {
        page?: string;
        limit?: string;
    }): Promise<{
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
    }>;
    applyPromosToMenus(menus: any[]): Promise<any[]>;
}
