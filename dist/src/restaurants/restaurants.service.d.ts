import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { CreatePromoDto } from './dto/create-promo.dto';
import { UpdatePromoDto } from './dto/update-promo.dto';
export declare class RestaurantsService {
    private prisma;
    private cloudinaryService;
    constructor(prisma: PrismaService, cloudinaryService: CloudinaryService);
    private getOwnedRestaurant;
    getRevenue(userId: string): Promise<{
        totalOrderRevenue: number;
        totalVoucherRevenue: number;
        grandTotal: number;
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
    }>;
    getAllMenus(userId: string): Promise<any[]>;
    createMenu(userId: string, dto: CreateMenuDto, file: Express.Multer.File): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        price: number;
        description: string;
        image: string;
        isAvailable: boolean;
        restaurantId: string;
    }>;
    getMenu(userId: string, menuId: string): Promise<any>;
    updateMenu(userId: string, menuId: string, dto: UpdateMenuDto): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        price: number;
        description: string;
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
    getMenusPublic(restaurantId: string): Promise<any[]>;
    getMenuDetailPublic(restaurantId: string, menuId: string): Promise<any>;
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
    applyPromosToMenus(menus: any[]): Promise<any[]>;
}
