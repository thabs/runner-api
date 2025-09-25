import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MediaOrderDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsNumber()
  order: number;
}
