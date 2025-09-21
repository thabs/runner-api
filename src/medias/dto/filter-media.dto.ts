import { IsArray, IsString } from 'class-validator';
import { MediaCategory } from '../entities/media-category';

export class FilterMediaDto {
  @IsString()
  searchTerm: string;

  @IsArray()
  categories: MediaCategory[];
}
