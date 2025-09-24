import { Media, ShoppingCentre } from '@app/models';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaSubscriber } from 'src/medias/subscriber/media.subscriber';
import { ShoppingCentresController } from './shopping-centres.controller';
import { ShoppingCentresService } from './shopping-centres.service';

@Module({
  imports: [TypeOrmModule.forFeature([ShoppingCentre, Media])],
  exports: [ShoppingCentresService],
  controllers: [ShoppingCentresController],
  providers: [ShoppingCentresService, MediaSubscriber],
})
export class ShoppingCentresModule {}
