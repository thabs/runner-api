import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlugsService } from './plugs.service';
import { CreatePlugDto } from './dto/create-plug.dto';
import { UpdatePlugDto } from './dto/update-plug.dto';

@Controller('plugs')
export class PlugsController {
  constructor(private readonly plugsService: PlugsService) {}

  @Post()
  create(@Body() createPlugDto: CreatePlugDto) {
    return this.plugsService.create(createPlugDto);
  }

  @Get()
  findAll() {
    return this.plugsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.plugsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlugDto: UpdatePlugDto) {
    return this.plugsService.update(+id, updatePlugDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.plugsService.remove(+id);
  }
}
