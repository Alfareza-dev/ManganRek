import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { BuyVoucherDto } from './dto/buy-voucher.dto';
export declare class VouchersService {
    private prisma;
    private configService;
    constructor(prisma: PrismaService, configService: ConfigService);
    private getAdminResto;
    create(adminId: string, dto: CreateVoucherDto): Promise<{
        id: string;
        createdAt: Date;
        price: number;
        restaurantId: string;
        title: string;
        value: number;
        expiryDate: Date;
    }>;
    findAll(adminId: string): Promise<{
        id: string;
        createdAt: Date;
        price: number;
        restaurantId: string;
        title: string;
        value: number;
        expiryDate: Date;
    }[]>;
    update(adminId: string, id: string, dto: UpdateVoucherDto): Promise<{
        id: string;
        createdAt: Date;
        price: number;
        restaurantId: string;
        title: string;
        value: number;
        expiryDate: Date;
    }>;
    remove(adminId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        price: number;
        restaurantId: string;
        title: string;
        value: number;
        expiryDate: Date;
    }>;
    buyVoucher(userId: string, dto: BuyVoucherDto): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.VoucherStatus;
        createdAt: Date;
        updatedAt: Date;
        uniqueCode: string | null;
        totalPaid: number;
        paymentUrl: string | null;
        userId: string;
        voucherId: string;
    }>;
    private generateUniqueCode;
    handleWebhook(payload: any): Promise<{
        received: boolean;
    }>;
}
