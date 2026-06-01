import { PrismaService } from '../prisma/prisma.service';
import { UpdateApprovalDto } from './dto/update-approval.dto';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    updateApproval(userId: string, dto: UpdateApprovalDto): Promise<{
        name: string;
        email: string;
        id: string;
        role: import("@prisma/client").$Enums.Role;
        status: import("@prisma/client").$Enums.AccountStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getPendingApprovals(): Promise<{
        restaurant: {
            name: string;
            id: string;
            address: string;
            legalPhoto: string;
        } | null;
        name: string;
        email: string;
        id: string;
        role: import("@prisma/client").$Enums.Role;
        status: import("@prisma/client").$Enums.AccountStatus;
        createdAt: Date;
    }[]>;
    getUsers(page: number, limit: number): Promise<{
        data: {
            name: string;
            email: string;
            password: string;
            id: string;
            role: import("@prisma/client").$Enums.Role;
            status: import("@prisma/client").$Enums.AccountStatus;
            createdAt: Date;
            updatedAt: Date;
            managedRestoId: string | null;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getOwners(page: number, limit: number): Promise<{
        data: ({
            restaurant: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                ownerId: string;
                address: string;
                latitude: number;
                longitude: number;
                legalPhoto: string;
            } | null;
        } & {
            name: string;
            email: string;
            password: string;
            id: string;
            role: import("@prisma/client").$Enums.Role;
            status: import("@prisma/client").$Enums.AccountStatus;
            createdAt: Date;
            updatedAt: Date;
            managedRestoId: string | null;
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getUserById(id: string): Promise<{
        restaurant: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            ownerId: string;
            address: string;
            latitude: number;
            longitude: number;
            legalPhoto: string;
        } | null;
        managedResto: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            ownerId: string;
            address: string;
            latitude: number;
            longitude: number;
            legalPhoto: string;
        } | null;
    } & {
        name: string;
        email: string;
        password: string;
        id: string;
        role: import("@prisma/client").$Enums.Role;
        status: import("@prisma/client").$Enums.AccountStatus;
        createdAt: Date;
        updatedAt: Date;
        managedRestoId: string | null;
    }>;
    getOwnerById(id: string): Promise<{
        restaurant: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            ownerId: string;
            address: string;
            latitude: number;
            longitude: number;
            legalPhoto: string;
        } | null;
    } & {
        name: string;
        email: string;
        password: string;
        id: string;
        role: import("@prisma/client").$Enums.Role;
        status: import("@prisma/client").$Enums.AccountStatus;
        createdAt: Date;
        updatedAt: Date;
        managedRestoId: string | null;
    }>;
    toggleBanUser(id: string): Promise<{
        email: string;
        id: string;
        status: import("@prisma/client").$Enums.AccountStatus;
    }>;
    deleteUser(id: string): Promise<{
        message: string;
    }>;
    upsertConfig(key: string, value: string): Promise<{
        id: string;
        updatedAt: Date;
        value: string;
        key: string;
    }>;
    getConfig(key: string): Promise<string | null>;
    getPlatformRevenue(): Promise<number>;
    getAllPayments(page: number, limit: number): Promise<{
        transactions: {
            data: ({
                user: {
                    name: string;
                    email: string;
                };
                voucher: {
                    restaurant: {
                        name: string;
                    };
                    title: string;
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
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
        orders: {
            data: ({
                restaurant: {
                    name: string;
                };
                cashier: {
                    name: string;
                };
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
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
