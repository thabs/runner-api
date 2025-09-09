import { Transform } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';

export class FindNearbyDto {
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

  @IsNumber()
  @Transform((obj) => parseFloat(obj.value))
  @Min(0)
  radiusKm: number;
}
