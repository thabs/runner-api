import { IsEnum } from 'class-validator';
import { MediaCategory } from '../entities/media-category';
import { MimeType } from '../entities/mime-type.enum';

export class CreateMediaDto {
  @IsEnum(MimeType)
  mimeType: MimeType;

  @IsEnum(MediaCategory)
  category: MediaCategory;
}
