// dto/filter-users.dto.ts
import { Department, PaginationRequestDto } from '@app/models';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsIn, IsOptional } from 'class-validator';

export type BrandOrderBy = 'name' | 'isActive';

export class FilterBrandDto extends PaginationRequestDto<BrandOrderBy> {
  @IsArray()
  @IsEnum(Department, { each: true })
  departments: Department[];

  @ApiPropertyOptional({ enum: ['name', 'isActive'], default: 'name' })
  @IsOptional()
  @IsIn(['name', 'isActive'])
  orderBy: BrandOrderBy = 'name';

  /** Columns that can be searched */
  readonly searchFields = ['name', 'tags.name'];
}
