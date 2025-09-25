import { ApiPaginatedResponse, ImageFileValidationPipe } from '@app/common';
import { Plug } from '@app/models';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { MediaOrderDto } from 'src/medias/dto/media-order.dto';
import { CreatePlugDto } from './dto/create-plug.dto';
import { FilterPlugDto } from './dto/filter-plug.dto';
import { UpdatePlugDto } from './dto/update-plug.dto';
import { PlugsService } from './plugs.service';

@Controller('plugs')
export class PlugsController {
  constructor(private readonly plugsService: PlugsService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 5)) // max 5 files
  @ApiConsumes('multipart/form-data')
  create(
    @Body() createPlugDto: CreatePlugDto,
    @UploadedFiles(new ImageFileValidationPipe()) files: Express.Multer.File[]
  ) {
    return this.plugsService.create(createPlugDto, files);
  }

  @Get()
  @ApiPaginatedResponse(Plug)
  findAll(@Query() filter: FilterPlugDto) {
    return this.plugsService.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.plugsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePlugDto: UpdatePlugDto) {
    return this.plugsService.update(id, updatePlugDto);
  }

  @Put('media/:id')
  @UseInterceptors(FilesInterceptor('files', 5)) // max 5 files
  @ApiConsumes('multipart/form-data')
  updateImages(
    @Param('id') id: string,
    @UploadedFiles(new ImageFileValidationPipe()) files: Express.Multer.File[]
  ) {
    return this.plugsService.updateImages(id, files);
  }

  @Put('images-order/:id')
  updateImagesOrder(@Param('id') id: string, @Body() imagesOrder: MediaOrderDto[]) {
    return this.plugsService.updateImagesOrder(id, imagesOrder);
  }

  @Put('active/:id/:isActive')
  updateActive(@Param('id') id: string, @Param('isActive') isActive: string) {
    const active = isActive === 'true'; // convert string to boolean
    return this.plugsService.updateActive(id, active);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.plugsService.remove(id);
  }
}
