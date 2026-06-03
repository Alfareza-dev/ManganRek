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
    findAll(req: Request): Promise<{
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
            isDeleted: boolean;
            createdAt: Date;
            value: number;
            price: number;
            title: string;
            restaurantId: string;
            stock: number;
            expiryDate: Date;
        })[];
    }>;
    findByRestoPublic(restoId: string): Promise<{
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
    findOne(req: Request, id: string): Promise<{
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
        };
    }>;
    update(req: Request, id: string, dto: UpdateVoucherDto): Promise<{
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
            status: import("@prisma/client").$Enums.VoucherStatus;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            voucherId: string;
            uniqueCode: string | null;
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
            status: import("@prisma/client").$Enums.VoucherStatus;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            voucherId: string;
            uniqueCode: string | null;
            totalPaid: number;
            platformFee: number;
            paymentUrl: string | null;
        };
    }>;
}
