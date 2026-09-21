import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LocationModule } from './location/location.module';
import { AppreciationModule } from './appreciation/appreciation.module';
import { validate } from './config/env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    LocationModule,
    AppreciationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}