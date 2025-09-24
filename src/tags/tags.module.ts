import { Tag } from '@app/models';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tag])],
  exports: [TagsService],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule {}
