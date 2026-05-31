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
        restaurant: {
            id: string;
            name: string;
            address: string;
            legalPhoto: string;
        } | null;
        id: string;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        status: import("@prisma/client").$Enums.AccountStatus;
        createdAt: Date;
    }[]>;
}
