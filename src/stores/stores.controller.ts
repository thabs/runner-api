import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { FilterStoreDto } from './dto/filter-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { StoresService } from './stores.service';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Post()
  create(@Body() createStoreDto: CreateStoreDto) {
    return this.storesService.create(createStoreDto);
  }

  @Get()
  async findAll(@Query() filter: FilterStoreDto) {
    return this.storesService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storesService.update(id, updateStoreDto);
  }

  @Put('active/:id/:isActive')
  updateActive(@Param('id') id: string, @Param('isActive') isActive: string) {
    const active = isActive === 'true'; // convert string to boolean
    return this.storesService.updateActive(id, active);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storesService.remove(id);
  }
}
