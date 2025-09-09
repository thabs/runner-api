import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateProvinceDto } from './dto/create-province.dto';
import { ProvinceService } from './provinces.service';

@Controller('provinces')
export class ProvinceController {
  constructor(private readonly provinceService: ProvinceService) {}

  @Post()
  create(@Body() dto: CreateProvinceDto) {
    return this.provinceService.create(dto);
  }

  @Get()
  findAll() {
    return this.provinceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.provinceService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.provinceService.remove(id);
  }
}
