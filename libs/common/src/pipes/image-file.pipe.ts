import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ImageFileValidationPipe implements PipeTransform {
  transform(value: Express.Multer.File) {
    if (!value) {
      throw new BadRequestException('File is required');
    }
    if (!value.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      throw new BadRequestException('Invalid file type, only images allowed');
    }
    return value;
  }
}
