import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateShoppingCentreDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
