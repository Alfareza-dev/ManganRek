import { PrismaService } from '../prisma/prisma.service';
import { ValidateVoucherDto } from './dto/validate-voucher.dto';
import { CreateOrderDto } from './dto/create-order.dto';
export declare class PosService {
    private prisma;
    constructor(prisma: PrismaService);
    validateVoucher(cashierId: string, dto: ValidateVoucherDto): Promise<{
        transactionId: string;
        voucherTitle: string;
        value: number;
        status: string;
    }>;
    getMenus(cashierId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        description: string;
        price: number;
        image: string;
        isAvailable: boolean;
        restaurantId: string;
    }[]>;
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
            discount: number;
            paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
            totalAmount: number;
            finalAmount: number;
            cashierId: string;
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
            discount: number;
            paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
            totalAmount: number;
            finalAmount: number;
            cashierId: string;
        };
        qr_string: string;
    } | undefined>;
}
