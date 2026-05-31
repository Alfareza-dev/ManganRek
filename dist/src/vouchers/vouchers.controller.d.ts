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
            createdAt: Date;
            price: number;
            restaurantId: string;
            title: string;
            value: number;
            expiryDate: Date;
        };
    }>;
    findAll(req: Request): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            createdAt: Date;
            price: number;
            restaurantId: string;
            title: string;
            value: number;
            expiryDate: Date;
        }[];
    }>;
    update(req: Request, id: string, dto: UpdateVoucherDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            createdAt: Date;
            price: number;
            restaurantId: string;
            title: string;
            value: number;
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
            uniqueCode: string | null;
            totalPaid: number;
            paymentUrl: string | null;
            userId: string;
            voucherId: string;
        };
    }>;
    handleWebhook(payload: any): Promise<{
        received: boolean;
    }>;
}
