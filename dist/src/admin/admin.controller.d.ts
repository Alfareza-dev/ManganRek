import { AdminService } from './admin.service';
import { UpdateApprovalDto } from './dto/update-approval.dto';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getPendingApprovals(): Promise<{
        success: boolean;
        message: string;
        data: {
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
        }[];
    }>;
    updateApproval(id: string, dto: UpdateApprovalDto): Promise<{
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
        };
    }>;
}
