// dto/filter-users.dto.ts
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class FilterShoppingCenterDto {
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
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn([
    'shoppingCentre.name',
    'shoppingCentre.isActive',
    'address.country',
    'address.province',
    'address.city',
    'address.suburb',
  ])
  orderBy?:
    | 'shoppingCentre.name'
    | 'shoppingCentre.isActive'
    | 'address.country'
    | 'address.province'
    | 'address.city'
    | 'address.suburb';

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
