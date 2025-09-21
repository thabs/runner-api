import { ImageFileValidationPipe, VideoFileValidationPipe } from '@app/common';
import { Controller, Get, Param, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes } from '@nestjs/swagger';
import { MediasService } from './medias.service';

@Controller('medias')
export class MediasController {
  constructor(private readonly mediasService: MediasService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mediasService.findOne(id);
  }

  @Put('image/:id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  updateImage(
    @Param('id') id: string,
    @UploadedFile(new ImageFileValidationPipe()) file: Express.Multer.File
  ) {
    return this.mediasService.update(id, file);
  }

  @Put('video/:id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  updateVideo(
    @Param('id') id: string,
    @UploadedFile(new VideoFileValidationPipe()) file: Express.Multer.File
  ) {
    return this.mediasService.update(id, file);
  }
}
