import { IsString } from 'class-validator';

export class CreatePlugDto {
  @IsString()
  description: string;

  @IsString()
  brandId: string;

  @IsString()
  categoryId: string;
}
