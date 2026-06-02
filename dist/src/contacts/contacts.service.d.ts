import { CreateContactDto } from './dto/create-contact.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare class ContactsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createContactDto: CreateContactDto): Promise<{
        success: boolean;
        message: string;
        data: {
            name: string;
            email: string;
            id: string;
            createdAt: Date;
            message: string;
        };
    }>;
    findAll(): Promise<{
        success: boolean;
        data: {
            name: string;
            email: string;
            id: string;
            createdAt: Date;
            message: string;
        }[];
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
