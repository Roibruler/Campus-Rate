import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppreciationService } from './appreciation.service';
import { AppreciationController } from './appreciation.controller';
import { AppreciationRepository } from './appreciation.repository';
import { Appreciation, AppreciationSchema } from './entities/appreciation.entity';
import { Location, LocationSchema } from '../location/entities/location.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Appreciation.name, schema: AppreciationSchema },
      { name: Location.name, schema: LocationSchema },
    ]),
  ],
  controllers: [AppreciationController],
  providers: [AppreciationService, AppreciationRepository],
})
export class AppreciationModule {}