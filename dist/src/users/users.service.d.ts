import { PrismaService } from '../prisma/prisma.service';
import { CreateCashierDto } from './dto/create-cashier.dto';
import { UpdateCashierDto } from './dto/update-cashier.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<{
        name: string;
        email: string;
        password: string;
        id: string;
        role: import("@prisma/client").$Enums.Role;
        status: import("@prisma/client").$Enums.AccountStatus;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        managedRestoId: string | null;
    } | null>;
    createCashier(adminId: string, dto: CreateCashierDto): Promise<{
        name: string;
        email: string;
        id: string;
        role: import("@prisma/client").$Enums.Role;
        status: import("@prisma/client").$Enums.AccountStatus;
        isDeleted: boolean;
        createdAt: Date;
        updatedAt: Date;
        managedRestoId: string | null;
    }>;
    getCashiers(adminId: string): Promise<{
        name: string;
        email: string;
        id: string;
        status: import("@prisma/client").$Enums.AccountStatus;
        createdAt: Date;
    }[]>;
    getCashierById(adminId: string, cashierId: string): Promise<{
        name: string;
        email: string;
        id: string;
        status: import("@prisma/client").$Enums.AccountStatus;
        createdAt: Date;
    }>;
    updateCashier(adminId: string, cashierId: string, dto: UpdateCashierDto): Promise<{
        name: string;
        email: string;
        id: string;
        status: import("@prisma/client").$Enums.AccountStatus;
    }>;
    updateCashierPassword(adminId: string, cashierId: string, newPassword: string): Promise<{
        message: string;
    }>;
    deleteCashier(adminId: string, cashierId: string): Promise<{
        message: string;
    }>;
}
