import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plug } from './entities/plug.entity';
import { PlugsController } from './plugs.controller';
import { PlugsService } from './plugs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Plug])],
  exports: [PlugsService],
  controllers: [PlugsController],
  providers: [PlugsService],
})
export class PlugsModule {}
