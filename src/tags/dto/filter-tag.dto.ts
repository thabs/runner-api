import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class FilterTagDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(['tag.name'])
  orderBy?: 'tag.name';

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
