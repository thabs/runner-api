import { MimeType } from '@app/models';
import { IsEnum, IsString } from 'class-validator';

export class UpdateMediaFileDto {
  @IsString()
  url: string;

  @IsEnum(MimeType)
  mimeType: MimeType;
}
