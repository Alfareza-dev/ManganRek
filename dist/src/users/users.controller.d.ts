import { UsersService } from './users.service';
import { CreateCashierDto } from './dto/create-cashier.dto';
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
            createdAt: Date;
            updatedAt: Date;
            managedRestoId: string | null;
        };
    }>;
}
