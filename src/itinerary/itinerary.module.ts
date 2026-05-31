import { Module } from '@nestjs/common';
import { ItineraryService } from './itinerary.service';
import { ItineraryController } from './itinerary.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ItineraryController],
  providers: [ItineraryService],
})
export class ItineraryModule {}
