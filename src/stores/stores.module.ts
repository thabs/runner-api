import { Store } from '@app/models';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandsModule } from 'src/brands/brands.module';
import { ShoppingCentresModule } from 'src/shopping-centres/shopping-centres.module';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';

@Module({
  imports: [TypeOrmModule.forFeature([Store]), BrandsModule, ShoppingCentresModule],
  controllers: [StoresController],
  providers: [StoresService],
})
export class StoresModule {}
