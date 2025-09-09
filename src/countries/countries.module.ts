import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';
import { Country } from './entities/country.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Country])],
  exports: [CountriesService],
  controllers: [CountriesController],
  providers: [CountriesService],
})
export class CountriesModule {}
