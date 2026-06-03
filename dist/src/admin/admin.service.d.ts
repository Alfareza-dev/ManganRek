import { PrismaService } from '../prisma/prisma.service';
import { UpdateApprovalDto } from './dto/update-approval.dto';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    updateApproval(userId: string, dto: UpdateApprovalDto): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        status: import("@prisma/client").$Enums.AccountStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getPendingApprovals(): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        status: import("@prisma/client").$Enums.AccountStatus;
        createdAt: Date;
        restaurant: {
            id: string;
            name: string;
            address: string;
            legalPhoto: string;
        } | null;
    }[]>;
    getUsers(page: number, limit: number): Promise<{
        data: {
            id: string;
            email: string;
            password: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
            status: import("@prisma/client").$Enums.AccountStatus;
            isDeleted: boolean;
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
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                address: string;
                latitude: number;
                longitude: number;
                legalPhoto: string;
                ownerId: string;
                category: string | null;
                openingHours: string | null;
                branches: string | null;
                googleMapsUrl: string | null;
                description: string | null;
                isOpen: boolean | null;
            } | null;
        } & {
            id: string;
            email: string;
            password: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
            status: import("@prisma/client").$Enums.AccountStatus;
            isDeleted: boolean;
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
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            address: string;
            latitude: number;
            longitude: number;
            legalPhoto: string;
            ownerId: string;
            category: string | null;
            openingHours: string | null;
            branches: string | null;
            googleMapsUrl: string | null;
            description: string | null;
            isOpen: boolean | null;
        } | null;
        managedResto: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            address: string;
            latitude: number;
            longitude: number;
            legalPhoto: string;
            ownerId: string;
            category: string | null;
            openingHours: string | null;
            branches: string | null;
            googleMapsUrl: string | null;
            description: string | null;
            isOpen: boolean | null;
        } | null;
    } & {
        id: string;
        email: string;
        password: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        status: import("@prisma/client").$Enums.AccountStatus;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        managedRestoId: string | null;
    }>;
    getOwnerById(id: string): Promise<{
        restaurant: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            address: string;
            latitude: number;
            longitude: number;
            legalPhoto: string;
            ownerId: string;
            category: string | null;
            openingHours: string | null;
            branches: string | null;
            googleMapsUrl: string | null;
            description: string | null;
            isOpen: boolean | null;
        } | null;
    } & {
        id: string;
        email: string;
        password: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        status: import("@prisma/client").$Enums.AccountStatus;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        managedRestoId: string | null;
    }>;
    toggleBanUser(id: string): Promise<{
        id: string;
        email: string;
        status: import("@prisma/client").$Enums.AccountStatus;
    }>;
    deleteUser(id: string): Promise<{
        message: string;
    }>;
    upsertConfig(key: string, value: string): Promise<{
        id: string;
        updatedAt: Date;
        key: string;
        value: string;
    }>;
    getConfig(key: string): Promise<string | null>;
    getAllPayments(page: number, limit: number): Promise<{
        transactions: {
            data: ({
                user: {
                    email: string;
                    name: string;
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
                cashierId: string;
                customerName: string | null;
                totalAmount: number;
                discount: number;
                finalAmount: number;
                paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
            })[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
