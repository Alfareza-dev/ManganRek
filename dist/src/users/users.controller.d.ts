import { UsersService } from './users.service';
import { CreateCashierDto } from './dto/create-cashier.dto';
import { UpdateCashierDto } from './dto/update-cashier.dto';
import type { Request } from 'express';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    createCashier(req: Request, dto: CreateCashierDto): Promise<{
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
            managedRestoId: string | null;
        };
    }>;
    getCashiers(req: Request): Promise<{
        success: boolean;
        message: string;
        data: {
            name: string;
            email: string;
            id: string;
            status: import("@prisma/client").$Enums.AccountStatus;
            createdAt: Date;
        }[];
    }>;
    getCashierById(req: Request, id: string): Promise<{
        success: boolean;
        message: string;
        data: {
            name: string;
            email: string;
            id: string;
            status: import("@prisma/client").$Enums.AccountStatus;
            createdAt: Date;
        };
    }>;
    updateCashier(req: Request, id: string, dto: UpdateCashierDto): Promise<{
        success: boolean;
        message: string;
        data: {
            name: string;
            email: string;
            id: string;
            status: import("@prisma/client").$Enums.AccountStatus;
        };
    }>;
    deleteCashier(req: Request, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
