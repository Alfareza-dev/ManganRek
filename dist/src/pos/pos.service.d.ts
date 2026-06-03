import { PrismaService } from '../prisma/prisma.service';
import { ValidateVoucherDto } from './dto/validate-voucher.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { RestaurantsService } from '../restaurants/restaurants.service';
export declare class PosService {
    private prisma;
    private restaurantsService;
    constructor(prisma: PrismaService, restaurantsService: RestaurantsService);
    validateVoucher(cashierId: string, dto: ValidateVoucherDto): Promise<{
        transactionId: string;
        voucherTitle: string;
        value: number;
        status: string;
    }>;
    getMenus(cashierId: string): Promise<any[]>;
    createOrder(cashierId: string, dto: CreateOrderDto): Promise<{
        success: boolean;
        message: string;
        order: {
            items: {
                id: string;
                createdAt: Date;
                price: number;
                menuId: string;
                quantity: number;
                orderId: string;
            }[];
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
        };
        qr_string?: undefined;
    } | {
        success: boolean;
        message: string;
        order: {
            items: {
                id: string;
                createdAt: Date;
                price: number;
                menuId: string;
                quantity: number;
                orderId: string;
            }[];
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
        };
        qr_string: string;
    } | undefined>;
    getOrderHistory(cashierId: string): Promise<({
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
    })[]>;
    verifyMockOrder(orderId: string): Promise<{
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
    }>;
    cancelOrder(cashierId: string, orderId: string): Promise<{
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
    }>;
}
