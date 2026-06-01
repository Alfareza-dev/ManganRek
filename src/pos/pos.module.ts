import { Module } from '@nestjs/common';
import { PosController } from './pos.controller';
import { PosService } from './pos.service';

import { PrismaModule } from '../prisma/prisma.module';
import { RestaurantsModule } from '../restaurants/restaurants.module';

@Module({
  imports: [PrismaModule, RestaurantsModule],
  controllers: [PosController],
  providers: [PosService]
})
export class PosModule {}
