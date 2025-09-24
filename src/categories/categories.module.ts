import { Category } from '@app/models';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediasModule } from 'src/medias/medias.module';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), MediasModule],
  exports: [CategoriesService],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
