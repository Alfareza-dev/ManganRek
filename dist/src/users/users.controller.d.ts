import { UsersService } from './users.service';
import { CreateCashierDto } from './dto/create-cashier.dto';
import { UpdateCashierDto } from './dto/update-cashier.dto';
import { UpdateCashierPasswordDto } from './dto/update-cashier-password.dto';
import type { Request } from 'express';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    createCashier(req: Request, dto: CreateCashierDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
            status: import("@prisma/client").$Enums.AccountStatus;
            isDeleted: boolean;
            createdAt: Date;
            updatedAt: Date;
            managedRestoId: string | null;
        };
    }>;
    getCashiers(req: Request): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            email: string;
            name: string;
            status: import("@prisma/client").$Enums.AccountStatus;
            createdAt: Date;
        }[];
    }>;
    getCashierById(req: Request, id: string): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            email: string;
            name: string;
            status: import("@prisma/client").$Enums.AccountStatus;
            createdAt: Date;
        };
    }>;
    updateCashier(req: Request, id: string, dto: UpdateCashierDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            email: string;
            name: string;
            status: import("@prisma/client").$Enums.AccountStatus;
        };
    }>;
    updateCashierPassword(req: Request, id: string, dto: UpdateCashierPasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    deleteCashier(req: Request, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
