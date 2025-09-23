import { Media, Plug } from '@app/models';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaSubscriber } from 'src/medias/subscriber/media.subscriber';
import { PlugsController } from './plugs.controller';
import { PlugsService } from './plugs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Plug, Media])],
  exports: [PlugsService],
  controllers: [PlugsController],
  providers: [PlugsService, MediaSubscriber],
})
export class PlugsModule {}
