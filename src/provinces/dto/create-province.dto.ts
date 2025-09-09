import { IsNumber, IsString } from 'class-validator';

export class CreateProvinceDto {
  @IsString()
  name: string;

  @IsNumber()
  countryId: string; 
}

