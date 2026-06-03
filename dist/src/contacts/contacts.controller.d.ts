import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
export declare class ContactsController {
    private readonly contactsService;
    constructor(contactsService: ContactsService);
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
