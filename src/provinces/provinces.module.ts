import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountriesModule } from 'countries/countries.module';
import { Province } from './entities/province.entity';
import { ProvinceController } from './provinces.controller';
import { ProvinceService } from './provinces.service';

@Module({
  imports: [TypeOrmModule.forFeature([Province]), CountriesModule],
  exports: [ProvinceService],
  controllers: [ProvinceController],
  providers: [ProvinceService],
})
export class ProvincesModule {}
