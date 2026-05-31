import { PrismaService } from '../prisma/prisma.service';
import { CreateCashierDto } from './dto/create-cashier.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<{
        id: string;
        email: string;
        password: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        status: import("@prisma/client").$Enums.AccountStatus;
        createdAt: Date;
        updatedAt: Date;
        managedRestoId: string | null;
    } | null>;
    createCashier(adminId: string, dto: CreateCashierDto): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        status: import("@prisma/client").$Enums.AccountStatus;
        createdAt: Date;
        updatedAt: Date;
        managedRestoId: string | null;
    }>;
}
