import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { RegisterRestoDto } from './dto/register-resto.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private cloudinaryService;
    constructor(prisma: PrismaService, jwtService: JwtService, cloudinaryService: CloudinaryService);
    registerUser(dto: RegisterUserDto): Promise<{
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
    registerResto(dto: RegisterRestoDto, file: Express.Multer.File): Promise<{
        user: {
            name: string;
            email: string;
            id: string;
            role: import("@prisma/client").$Enums.Role;
            status: import("@prisma/client").$Enums.AccountStatus;
            isDeleted: boolean;
            createdAt: Date;
            updatedAt: Date;
            managedRestoId: string | null;
        };
        restaurant: {
            name: string;
            id: string;
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
    }>;
    login(dto: LoginDto): Promise<{
        token: string;
        user: {
            name: string;
            email: string;
            id: string;
            role: import("@prisma/client").$Enums.Role;
            status: import("@prisma/client").$Enums.AccountStatus;
            isDeleted: boolean;
            createdAt: Date;
            updatedAt: Date;
            managedRestoId: string | null;
        };
    }>;
    getProfile(userId: string): Promise<{
        restaurant: {
            name: string;
            id: string;
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
        name: string;
        email: string;
        id: string;
        role: import("@prisma/client").$Enums.Role;
        status: import("@prisma/client").$Enums.AccountStatus;
        managedRestoId: string | null;
    }>;
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        name: string;
        email: string;
        id: string;
        role: import("@prisma/client").$Enums.Role;
        status: import("@prisma/client").$Enums.AccountStatus;
    }>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
}
