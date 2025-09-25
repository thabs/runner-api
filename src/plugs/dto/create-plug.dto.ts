import { IsString } from 'class-validator';

export class CreatePlugDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  brandId: string;

  @IsString()
  categoryId: string;
}
