import { PaginationRequestDto } from '@app/models/requests/pagination-request';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';

export type ShoppingCentreOrderBy =
  | 'name'
  | 'isActive'
  | 'address.country'
  | 'address.province'
  | 'address.city';

export class FilterShoppingCenterDto extends PaginationRequestDto<ShoppingCentreOrderBy> {
  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  province?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isActive?: boolean;

  @ApiPropertyOptional({
    enum: ['name', 'isActive', 'address.country', 'address.province', 'address.city'],
    default: 'name',
  })
  @IsOptional()
  @IsIn(['name', 'isActive', 'address.country', 'address.province', 'address.city'])
  orderBy: ShoppingCentreOrderBy = 'name';

  /** Columns that can be searched */
  readonly searchFields = ['name', 'tags.name'];
}
