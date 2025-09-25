import { Brand } from '@app/models/entities/brand.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediasModule } from 'src/medias/medias.module';
import { TagsModule } from 'src/tags/tags.module';
import { BrandsController } from './brands.controller';
import { BrandsService } from './brands.service';

@Module({
  imports: [TypeOrmModule.forFeature([Brand]), MediasModule, TagsModule],
  exports: [BrandsService],
  controllers: [BrandsController],
  providers: [BrandsService],
})
export class BrandsModule {}
