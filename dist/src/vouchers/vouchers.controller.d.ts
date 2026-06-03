import { VouchersService } from './vouchers.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { BuyVoucherDto } from './dto/buy-voucher.dto';
import type { Request } from 'express';
export declare class VouchersController {
    private readonly vouchersService;
    constructor(vouchersService: VouchersService);
    create(req: Request, dto: CreateVoucherDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            title: string;
            price: number;
            value: number;
            stock: number;
            expiryDate: Date;
            isDeleted: boolean;
            createdAt: Date;
            restaurantId: string;
        };
    }>;
    findAll(req: Request): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            title: string;
            price: number;
            value: number;
            stock: number;
            expiryDate: Date;
            isDeleted: boolean;
            createdAt: Date;
            restaurantId: string;
        }[];
    }>;
    findAllPublic(): Promise<{
        success: boolean;
        message: string;
        data: ({
            restaurant: {
                name: string;
                address: string;
            };
        } & {
            id: string;
            title: string;
            price: number;
            value: number;
            stock: number;
            expiryDate: Date;
            isDeleted: boolean;
            createdAt: Date;
            restaurantId: string;
        })[];
    }>;
    findByRestoPublic(restoId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            title: string;
            price: number;
            value: number;
            stock: number;
            expiryDate: Date;
            isDeleted: boolean;
            createdAt: Date;
            restaurantId: string;
        }[];
    }>;
    getUserHistory(req: Request): Promise<{
        success: boolean;
        message: string;
        data: ({
            voucher: {
                restaurant: {
                    name: string;
                    address: string;
                    legalPhoto: string;
                };
            } & {
                id: string;
                title: string;
                price: number;
                value: number;
                stock: number;
                expiryDate: Date;
                isDeleted: boolean;
                createdAt: Date;
                restaurantId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            uniqueCode: string | null;
            userId: string;
            voucherId: string;
            status: import("@prisma/client").$Enums.VoucherStatus;
            totalPaid: number;
            platformFee: number;
            paymentUrl: string | null;
        })[];
    }>;
    findOne(req: Request, id: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            title: string;
            price: number;
            value: number;
            stock: number;
            expiryDate: Date;
            isDeleted: boolean;
            createdAt: Date;
            restaurantId: string;
        };
    }>;
    update(req: Request, id: string, dto: UpdateVoucherDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            title: string;
            price: number;
            value: number;
            stock: number;
            expiryDate: Date;
            isDeleted: boolean;
            createdAt: Date;
            restaurantId: string;
        };
    }>;
    remove(req: Request, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    buyVoucher(req: Request, dto: BuyVoucherDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            uniqueCode: string | null;
            userId: string;
            voucherId: string;
            status: import("@prisma/client").$Enums.VoucherStatus;
            totalPaid: number;
            platformFee: number;
            paymentUrl: string | null;
        };
    }>;
    handleWebhook(payload: any): Promise<{
        received: boolean;
    }>;
    verifyMockTransaction(id: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            uniqueCode: string | null;
            userId: string;
            voucherId: string;
            status: import("@prisma/client").$Enums.VoucherStatus;
            totalPaid: number;
            platformFee: number;
            paymentUrl: string | null;
        };
    }>;
}
