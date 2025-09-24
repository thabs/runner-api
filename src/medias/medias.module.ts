import { Media } from '@app/models';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediasController } from './medias.controller';
import { MediasService } from './medias.service';
import { MediaSubscriber } from './subscriber/media.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([Media]), HttpModule],
  exports: [MediasService],
  controllers: [MediasController],
  providers: [MediasService, MediaSubscriber],
})
export class MediasModule {}
