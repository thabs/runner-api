import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Category } from '../entities/category.enum';

export class CreateStoreDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsArray()
  categories: Category[];

  @IsOptional()
  @IsString()
  contactPerson?: string;

  @IsOptional()
  @IsString()
  contactNumber?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  facebook?: string;

  @IsNotEmpty()
  @IsUUID()
  shoppingCentreId: string;
}
