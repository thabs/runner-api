// dto/filter-users.dto.ts
import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { Category } from 'stores/entities/category.enum';

export class FilterStoreDto {
  @IsOptional()
  @IsArray()
  @IsEnum(Category, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  categories?: Category[];

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isActive?: boolean;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(['store.name', 'store.isActive', 'shoppingCentre.name'])
  orderBy?: 'store.name' | 'store.isActive' | 'shoppingCentre.name';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  orderDirection?: 'ASC' | 'DESC';

  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  limit?: number = 10;
}
