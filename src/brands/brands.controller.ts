import { ApiPaginatedResponse, ImageFileValidationPipe } from '@app/common';
import { Brand } from '@app/models';
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
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { FilterBrandDto } from './dto/filter-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  create(
    @UploadedFile(new ImageFileValidationPipe()) file: Express.Multer.File,
    @Body() createBrandDto: CreateBrandDto
  ) {
    return this.brandsService.create(file, createBrandDto);
  }

  @Get()
  @ApiPaginatedResponse(Brand)
  findAll(@Query() filter: FilterBrandDto) {
    return this.brandsService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandsService.update(id, updateBrandDto);
  }

  @Put('active/:id/:active')
  activate(@Param('id') id: string, @Param('active') active: boolean) {
    return this.brandsService.activate(id, active);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandsService.remove(id);
  }
}
