import { PosService } from './pos.service';
import { ValidateVoucherDto } from './dto/validate-voucher.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import type { Request } from 'express';
export declare class PosController {
    private readonly posService;
    constructor(posService: PosService);
    validateVoucher(req: Request, dto: ValidateVoucherDto): Promise<{
        success: boolean;
        message: string;
        data: {
            transactionId: string;
            voucherTitle: string;
            value: number;
            status: string;
        };
    }>;
    createOrder(req: Request, dto: CreateOrderDto): Promise<{
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
    getMenus(req: Request): Promise<{
        success: boolean;
        message: string;
        data: {
            name: string;
            id: string;
            createdAt: Date;
            description: string;
            price: number;
            image: string;
            isAvailable: boolean;
            restaurantId: string;
        }[];
    }>;
}
