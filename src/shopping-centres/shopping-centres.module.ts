import { ShoppingCentre } from '@app/models';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressesModule } from 'src/addresses/addresses.module';
import { MediasModule } from 'src/medias/medias.module';
import { ShoppingCentresController } from './shopping-centres.controller';
import { ShoppingCentresService } from './shopping-centres.service';

@Module({
  imports: [TypeOrmModule.forFeature([ShoppingCentre]), AddressesModule, MediasModule],
  exports: [ShoppingCentresService],
  controllers: [ShoppingCentresController],
  providers: [ShoppingCentresService],
})
export class ShoppingCentresModule {}
