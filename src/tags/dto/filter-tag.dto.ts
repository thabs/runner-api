import { PaginationRequestDto } from '@app/models';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

export type TagOrderBy = 'name';

export class FilterTagDto extends PaginationRequestDto<TagOrderBy> {
  @ApiPropertyOptional({
    enum: ['name'],
    default: 'name',
  })
  @IsOptional()
  @IsIn(['name'])
  orderBy: TagOrderBy = 'name';

  /** Columns that can be searched */
  readonly searchFields = ['name', 'brands.name'];
}
