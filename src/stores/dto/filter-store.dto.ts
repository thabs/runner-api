import { PaginationRequestDto } from '@app/models/requests/pagination-request';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsIn, IsOptional, IsUUID } from 'class-validator';

export type StoreOrderBy = 'brand.name' | 'shoppingCentre.name' | 'isActive';

export class FilterStoreDto extends PaginationRequestDto<StoreOrderBy> {
  @IsOptional()
  @IsUUID()
  brandId: string;

  @IsOptional()
  @IsUUID()
  shoppingCentreId: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  isActive?: boolean;

  @ApiPropertyOptional({
    enum: ['brand.name', 'shoppingCentre.name', 'isActive'],
    default: 'brand.name',
  })
  @IsOptional()
  @IsIn(['brand.name', 'shoppingCentre.name', 'isActive'])
  orderBy: StoreOrderBy = 'brand.name';

  /** Columns that can be searched */
  readonly searchFields = ['brand.name', 'shoppingCentre.name'];
}
