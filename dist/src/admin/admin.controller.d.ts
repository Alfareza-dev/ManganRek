import { AdminService } from './admin.service';
import { UpdateApprovalDto } from './dto/update-approval.dto';
import { UpdateConfigDto } from './dto/system-config.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    updateConfig(dto: UpdateConfigDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            updatedAt: Date;
            value: string;
            key: string;
        };
    }>;
    getConfig(key: string): Promise<{
        success: boolean;
        message: string;
        data: {
            key: string;
            value: string | null;
        };
    }>;
    getRevenue(): Promise<{
        success: boolean;
        message: string;
        data: {
            totalPlatformFee: number;
        };
    }>;
    getPendingApprovals(): Promise<{
        success: boolean;
        message: string;
        data: {
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
        }[];
    }>;
    updateApproval(id: string, dto: UpdateApprovalDto): Promise<{
        success: boolean;
        message: string;
        data: {
            name: string;
            email: string;
            id: string;
            role: import("@prisma/client").$Enums.Role;
            status: import("@prisma/client").$Enums.AccountStatus;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    getUsers(page?: string, limit?: string): Promise<{
        success: boolean;
        message: string;
        data: {
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
        };
    }>;
    getOwners(page?: string, limit?: string): Promise<{
        success: boolean;
        message: string;
        data: {
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
        };
    }>;
    getUserById(id: string): Promise<{
        success: boolean;
        message: string;
        data: {
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
        };
    }>;
    getOwnerById(id: string): Promise<{
        success: boolean;
        message: string;
        data: {
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
        };
    }>;
    toggleBanUser(id: string): Promise<{
        success: boolean;
        message: string;
        data: {
            email: string;
            id: string;
            status: import("@prisma/client").$Enums.AccountStatus;
        };
    }>;
    deleteUser(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
