import { Transform } from 'class-transformer';
import { IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  street: string;

  @IsString()
  businessName?: string;

  @IsString()
  complex?: string;

  @IsString()
  suburb: string;

  @IsString()
  city: string;

  @IsString()
  province: string;

  @IsString()
  country: string;

  @IsString()
  postalCode: string;

  @IsNumber()
  @Transform((obj) => parseFloat(obj.value))
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsNumber()
  @Transform((obj) => parseFloat(obj.value))
  @Min(-180)
  @Max(180)
  longitude: number;
}
