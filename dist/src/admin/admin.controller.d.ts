import { AdminService } from './admin.service';
import { UpdateApprovalDto } from './dto/update-approval.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getAllPayments(page?: string, limit?: string): Promise<{
        success: boolean;
        message: string;
        data: {
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
                    userId: string;
                    voucherId: string;
                    uniqueCode: string | null;
                    status: import("@prisma/client").$Enums.VoucherStatus;
                    totalPaid: number;
                    platformFee: number;
                    paymentUrl: string | null;
                    createdAt: Date;
                    updatedAt: Date;
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
        };
    }>;
    getPendingApprovals(): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            status: import("@prisma/client").$Enums.AccountStatus;
            createdAt: Date;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
            restaurant: {
                id: string;
                name: string;
                address: string;
                legalPhoto: string;
            } | null;
        }[];
    }>;
    updateApproval(id: string, dto: UpdateApprovalDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            status: import("@prisma/client").$Enums.AccountStatus;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
        };
    }>;
    getUsers(page?: string, limit?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            data: {
                id: string;
                status: import("@prisma/client").$Enums.AccountStatus;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                password: string;
                name: string;
                role: import("@prisma/client").$Enums.Role;
                isDeleted: boolean;
                managedRestoId: string | null;
            }[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getOwners(page?: string, limit?: string): Promise<{
        success: boolean;
        message: string;
        data: {
            data: ({
                restaurant: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
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
                status: import("@prisma/client").$Enums.AccountStatus;
                createdAt: Date;
                updatedAt: Date;
                email: string;
                password: string;
                name: string;
                role: import("@prisma/client").$Enums.Role;
                isDeleted: boolean;
                managedRestoId: string | null;
            })[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getUserById(id: string): Promise<{
        success: boolean;
        message: string;
        data: {
            restaurant: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
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
                createdAt: Date;
                updatedAt: Date;
                name: string;
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
            status: import("@prisma/client").$Enums.AccountStatus;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            password: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
            isDeleted: boolean;
            managedRestoId: string | null;
        };
    }>;
    getOwnerById(id: string): Promise<{
        success: boolean;
        message: string;
        data: {
            restaurant: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
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
            status: import("@prisma/client").$Enums.AccountStatus;
            createdAt: Date;
            updatedAt: Date;
            email: string;
            password: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
            isDeleted: boolean;
            managedRestoId: string | null;
        };
    }>;
    toggleBanUser(id: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            status: import("@prisma/client").$Enums.AccountStatus;
            email: string;
        };
    }>;
    deleteUser(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    toggleBanOwner(id: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            status: import("@prisma/client").$Enums.AccountStatus;
            email: string;
        };
    }>;
    deleteOwner(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
