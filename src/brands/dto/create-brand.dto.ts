import { Department } from '@app/models';
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
  @IsEnum(Department, { each: true })
  departments: Department[];

  @IsArray()
  @IsString({ each: true })
  tagIds: string[];
}
