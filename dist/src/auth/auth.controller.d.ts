import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterRestoDto } from './dto/register-resto.dto';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express';
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
            createdAt: Date;
            updatedAt: Date;
            managedRestoId: string | null;
        };
    }>;
    registerResto(dto: RegisterRestoDto): Promise<{
        success: boolean;
        message: string;
        data: {
            user: {
                id: string;
                email: string;
                name: string;
                role: import("@prisma/client").$Enums.Role;
                status: import("@prisma/client").$Enums.AccountStatus;
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
            createdAt: Date;
            updatedAt: Date;
            managedRestoId: string | null;
        };
    }>;
}
