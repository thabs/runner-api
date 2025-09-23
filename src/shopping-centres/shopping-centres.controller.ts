import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateShoppingCentreDto } from './dto/create-shopping-centre.dto';
import { FilterShoppingCenterDto } from './dto/filter-shopping-centre.dto';
import { FindNearbyDto } from './dto/find-nearby.dto';
import { UpdateShoppingCentreDto } from './dto/update-shopping-centre.dto';
import { ShoppingCentresService } from './shopping-centres.service';

@Controller('shopping-centres')
export class ShoppingCentresController {
  constructor(private readonly shoppingCentresService: ShoppingCentresService) {}

  @Post()
  create(@Body() createShoppingCentreDto: CreateShoppingCentreDto) {
    return this.shoppingCentresService.create(createShoppingCentreDto);
  }

  @Get()
  findAll(@Query() filter: FilterShoppingCenterDto) {
    return this.shoppingCentresService.findAll(filter);
  }

  @Get('nearby')
  findNearby(@Query() findNearbyDto: FindNearbyDto) {
    return this.shoppingCentresService.findNearby(findNearbyDto);
  }

  @Get('countries')
  findCountries() {
    return this.shoppingCentresService.findCountries();
  }

  @Get('provinces')
  findProvinces(@Query('country') country: string) {
    return this.shoppingCentresService.findProvincesByCountry(country);
  }

  @Get('cities')
  async findCities(@Query('country') country: string, @Query('province') province: string) {
    return this.shoppingCentresService.findCitiesByProvince(country, province);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shoppingCentresService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateShoppingCentreDto: UpdateShoppingCentreDto) {
    return this.shoppingCentresService.update(id, updateShoppingCentreDto);
  }

  @Put('active/:id/:active')
  activate(@Param('id') id: string, @Param('active') active: boolean) {
    return this.shoppingCentresService.activate(id, active);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shoppingCentresService.remove(id);
  }
}
