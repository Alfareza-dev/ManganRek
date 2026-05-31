import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterRestoDto } from './dto/register-resto.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    registerUser(dto: RegisterUserDto): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        status: import("@prisma/client").$Enums.AccountStatus;
        createdAt: Date;
        updatedAt: Date;
        managedRestoId: string | null;
    }>;
    registerResto(dto: RegisterRestoDto): Promise<{
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
    }>;
    login(dto: LoginDto): Promise<{
        token: string;
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
    }>;
}
