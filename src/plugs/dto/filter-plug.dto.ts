import { Department, PaginationRequestDto } from '@app/models';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsIn, IsOptional, IsString } from 'class-validator';

export type PlugOrderBy = 'brand.name' | 'category.name' | 'isActive';

export class FilterPlugDto extends PaginationRequestDto<PlugOrderBy> {
  @IsOptional()
  @IsArray()
  @IsEnum(Department, { each: true })
  departments: Department[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoryIds: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  brandIds: string[];

  @IsOptional()
  @Transform(({ value }) => value === 'true') // converts query string to boolean
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ enum: ['brand.name', 'category.name', 'isActive'], default: 'brand.name' })
  @IsOptional()
  @IsIn(['brand.name', 'category.name', 'isActive'])
  orderBy: PlugOrderBy = 'brand.name';

  /** Columns that can be searched */
  readonly searchFields = ['description', 'brand.name'];
}
