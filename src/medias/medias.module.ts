import { Media } from '@app/models';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediasController } from './medias.controller';
import { MediasService } from './medias.service';

@Module({
  imports: [TypeOrmModule.forFeature([Media])],
  exports: [MediasService],
  controllers: [MediasController],
  providers: [MediasService],
})
export class MediasModule {}
