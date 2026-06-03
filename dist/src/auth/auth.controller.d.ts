import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import type { Response, Request } from 'express';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    registerUser(dto: RegisterUserDto): Promise<{
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
    registerResto(req: Request, file: Express.Multer.File): Promise<{
        success: boolean;
        message: string;
        data: {
            user: {
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
            restaurant: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                ownerId: string;
                address: string;
                latitude: number;
                longitude: number;
                legalPhoto: string;
                category: string | null;
                openingHours: string | null;
                branches: string | null;
                googleMapsUrl: string | null;
                description: string | null;
                isOpen: boolean | null;
            };
        };
    }>;
    login(dto: LoginDto, res: Response): Promise<{
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
        token: string;
    }>;
    logout(res: Response): Promise<{
        success: boolean;
        message: string;
    }>;
    getMe(req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            restaurant: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                ownerId: string;
                address: string;
                latitude: number;
                longitude: number;
                legalPhoto: string;
                category: string | null;
                openingHours: string | null;
                branches: string | null;
                googleMapsUrl: string | null;
                description: string | null;
                isOpen: boolean | null;
            } | null;
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
            status: import("@prisma/client").$Enums.AccountStatus;
            managedRestoId: string | null;
        };
    }>;
    updateProfile(req: any, dto: UpdateProfileDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
            status: import("@prisma/client").$Enums.AccountStatus;
        };
    }>;
    changePassword(req: any, dto: ChangePasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
