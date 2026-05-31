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
}
