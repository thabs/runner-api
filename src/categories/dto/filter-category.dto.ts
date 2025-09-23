import { Department, PaginationRequestDto } from '@app/models';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsIn, IsOptional } from 'class-validator';

export type CategoryOrderBy = 'name' | 'department';

export class FilterCategoryDto extends PaginationRequestDto<CategoryOrderBy> {
  @IsArray()
  @IsEnum(Department, { each: true })
  departments: Department[];

  @ApiPropertyOptional({ enum: ['name', 'department'], default: 'name' })
  @IsOptional()
  @IsIn(['name', 'department'])
  orderBy: CategoryOrderBy = 'name';

  /** Columns that can be searched */
  readonly searchFields = ['name', 'department'];
}
