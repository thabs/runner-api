import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProvincesModule } from 'provinces/provinces.module';
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';
import { City } from './entities/city.entity';

@Module({
  imports: [TypeOrmModule.forFeature([City]), ProvincesModule],
  controllers: [CitiesController],
  providers: [CitiesService],
})
export class CitiesModule {}
