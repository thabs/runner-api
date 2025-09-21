import { Category } from 'brands/entities/category.enum';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateBrandDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  facebook?: string;

  @IsArray()
  @IsEnum(Category, { each: true })
  categories: Category[];

  @IsArray()
  @IsString({ each: true })
  tagIds: string[];
}
