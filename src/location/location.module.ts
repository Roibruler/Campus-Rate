import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { LocationRepository } from './location.repository';
import { Location, LocationSchema } from './entities/location.entity';
import { Appreciation, AppreciationSchema } from '../appreciation/entities/appreciation.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Location.name, schema: LocationSchema },
      { name: Appreciation.name, schema: AppreciationSchema },
    ]),
  ],
  controllers: [LocationController],
  providers: [LocationService, LocationRepository],
})
export class LocationModule {}