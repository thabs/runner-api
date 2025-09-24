import { Address } from '@app/models';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressesController } from './addresses.controller';
import { AddressesService } from './addresses.service';

@Module({
  imports: [TypeOrmModule.forFeature([Address])],
  exports: [AddressesService],
  controllers: [AddressesController],
  providers: [AddressesService],
})
export class AddressesModule {}
