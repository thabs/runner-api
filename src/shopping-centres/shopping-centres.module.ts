import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShoppingCentre } from './entities/shopping-centre.entity';
import { ShoppingCentresController } from './shopping-centres.controller';
import { ShoppingCentresService } from './shopping-centres.service';

@Module({
  imports: [TypeOrmModule.forFeature([ShoppingCentre])],
  exports: [ShoppingCentresService],
  controllers: [ShoppingCentresController],
  providers: [ShoppingCentresService],
})
export class ShoppingCentresModule {}
