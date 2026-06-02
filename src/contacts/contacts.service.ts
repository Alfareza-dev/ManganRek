import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { PrismaService } from '../prisma/prisma.service'; // Assuming PrismaService is available

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  async create(createContactDto: CreateContactDto) {
    try {
      const contact = await this.prisma.contactMessage.create({
        data: {
          name: createContactDto.name,
          email: createContactDto.email,
          message: createContactDto.message,
        },
      });
      return { success: true, message: 'Message sent successfully', data: contact };
    } catch (error) {
      throw new InternalServerErrorException('Failed to send message');
    }
  }

  async findAll() {
    try {
      const messages = await this.prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return { success: true, data: messages };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch messages');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.contactMessage.delete({
        where: { id },
      });
      return { success: true, message: 'Message deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete message');
    }
  }
}
