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
    }>;
    updateProfile(userId: string, dto: UpdateRestaurantDto): Promise<{
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
    }>;
    getAllMenus(userId: string): Promise<any[]>;
    createMenu(userId: string, dto: CreateMenuDto, file: Express.Multer.File): Promise<{
        name: string;
        id: string;
        isDeleted: boolean;
        createdAt: Date;
        description: string;
        price: number;
        image: string;
        isAvailable: boolean;
        restaurantId: string;
    }>;
    getMenu(userId: string, menuId: string): Promise<any>;
    updateMenu(userId: string, menuId: string, dto: UpdateMenuDto, file?: Express.Multer.File): Promise<{
        name: string;
        id: string;
        isDeleted: boolean;
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
    getAllPromos(userId: string): Promise<({
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
    })[]>;
    createPromo(userId: string, dto: CreatePromoDto): Promise<{
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
    }>;
    getPromo(userId: string, promoId: string): Promise<{
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
    }>;
    updatePromo(userId: string, promoId: string, dto: UpdatePromoDto): Promise<{
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
    }>;
    getMenusPublic(restaurantId: string): Promise<any[]>;
    getMenuDetailPublic(restaurantId: string, menuId: string): Promise<any>;
    getVouchersPublic(restaurantId: string): Promise<{
        id: string;
        isDeleted: boolean;
        createdAt: Date;
        value: number;
        price: number;
        title: string;
        restaurantId: string;
        stock: number;
        expiryDate: Date;
    }[]>;
    getVoucherDetailPublic(restaurantId: string, voucherId: string): Promise<{
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
    }>;
    getPromosPublic(restaurantId: string): Promise<{
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
    }[]>;
    getPromoDetailPublic(restaurantId: string, promoId: string): Promise<{
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
    }>;
    getAllPromosPublic(query: {
        page?: string;
        limit?: string;
    }): Promise<{
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
    }>;
    applyPromosToMenus(menus: any[]): Promise<any[]>;
}
