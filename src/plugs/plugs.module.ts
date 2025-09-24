import { Media, Plug } from '@app/models';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandsModule } from 'src/brands/brands.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { MediasModule } from 'src/medias/medias.module';
import { PlugsController } from './plugs.controller';
import { PlugsService } from './plugs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Plug, Media]), BrandsModule, CategoriesModule, MediasModule],
  controllers: [PlugsController],
  providers: [PlugsService],
})
export class PlugsModule {}
