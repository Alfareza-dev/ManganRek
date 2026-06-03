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
        title: string;
        price: number;
        value: number;
        stock: number;
        expiryDate: Date;
        isDeleted: boolean;
        createdAt: Date;
        restaurantId: string;
    }>;
    findAll(adminId: string): Promise<{
        id: string;
        title: string;
        price: number;
        value: number;
        stock: number;
        expiryDate: Date;
        isDeleted: boolean;
        createdAt: Date;
        restaurantId: string;
    }[]>;
    findOne(adminId: string, id: string): Promise<{
        id: string;
        title: string;
        price: number;
        value: number;
        stock: number;
        expiryDate: Date;
        isDeleted: boolean;
        createdAt: Date;
        restaurantId: string;
    }>;
    update(adminId: string, id: string, dto: UpdateVoucherDto): Promise<{
        id: string;
        title: string;
        price: number;
        value: number;
        stock: number;
        expiryDate: Date;
        isDeleted: boolean;
        createdAt: Date;
        restaurantId: string;
    }>;
    remove(adminId: string, id: string): Promise<{
        id: string;
        title: string;
        price: number;
        value: number;
        stock: number;
        expiryDate: Date;
        isDeleted: boolean;
        createdAt: Date;
        restaurantId: string;
    }>;
    buyVoucher(userId: string, dto: BuyVoucherDto): Promise<{
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
    }>;
    private generateUniqueCode;
    handleWebhook(payload: any): Promise<{
        received: boolean;
    }>;
    verifyMockTransaction(transactionId: string): Promise<{
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
    }>;
    findAllPublic(): Promise<({
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
    })[]>;
    findByRestoPublic(restoId: string): Promise<{
        id: string;
        title: string;
        price: number;
        value: number;
        stock: number;
        expiryDate: Date;
        isDeleted: boolean;
        createdAt: Date;
        restaurantId: string;
    }[]>;
    getUserHistory(userId: string): Promise<({
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
    })[]>;
}
