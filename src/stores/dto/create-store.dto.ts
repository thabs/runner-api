import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateStoreDto {
  @IsOptional()
  @IsString()
  contactPerson?: string;

  @IsOptional()
  @IsString()
  contactNumber?: string;

  @IsNotEmpty()
  @IsUUID()
  brandId: string;

  @IsNotEmpty()
  @IsUUID()
  shoppingCentreId: string;
}
