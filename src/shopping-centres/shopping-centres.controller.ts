import { ApiPaginatedResponse, ImageFileValidationPipe } from '@app/common';
import { ShoppingCentre } from '@app/models';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { CreateShoppingCentreDto } from './dto/create-shopping-centre.dto';
import { FilterShoppingCenterDto } from './dto/filter-shopping-centre.dto';
import { FindNearbyDto } from './dto/find-nearby.dto';
import { UpdateShoppingCentreDto } from './dto/update-shopping-centre.dto';
import { ShoppingCentresService } from './shopping-centres.service';

@Controller('shopping-centres')
export class ShoppingCentresController {
  constructor(private readonly shoppingCentresService: ShoppingCentresService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  create(
    @Body() createShoppingCentreDto: CreateShoppingCentreDto,
    @UploadedFile(new ImageFileValidationPipe()) file: Express.Multer.File
  ) {
    return this.shoppingCentresService.create(createShoppingCentreDto, file);
  }

  @Get()
  @ApiPaginatedResponse(ShoppingCentre)
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
    return this.shoppingCentresService.findProvinces(country);
  }

  @Get('cities')
  async findCities(@Query('country') country: string, @Query('province') province: string) {
    return this.shoppingCentresService.findCities(country, province);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shoppingCentresService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateShoppingCentreDto: UpdateShoppingCentreDto) {
    return this.shoppingCentresService.update(id, updateShoppingCentreDto);
  }

  @Put('image/:id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  updateImage(
    @Param('id') id: string,
    @UploadedFile(new ImageFileValidationPipe()) file: Express.Multer.File
  ) {
    return this.shoppingCentresService.updateImage(id, file);
  }

  @Put('active/:id/:isActive')
  updateActive(@Param('id') id: string, @Param('isActive') isActive: string) {
    const active = isActive === 'true'; // convert string to boolean
    return this.shoppingCentresService.updateActive(id, active);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shoppingCentresService.remove(id);
  }
}
