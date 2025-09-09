import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlugsModule } from 'plugs/plugs.module';
import { ShoppingCentresModule } from 'shopping-centres/shopping-centres.module';
import { TagsModule } from 'tags/tags.module';
import { Store } from './entities/store.entity';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';

@Module({
  imports: [TypeOrmModule.forFeature([Store]), ShoppingCentresModule, TagsModule, PlugsModule],
  controllers: [StoresController],
  providers: [StoresService],
})
export class StoresModule {}
