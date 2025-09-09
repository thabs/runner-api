import { IsArray, IsNotEmpty } from 'class-validator';

export class AssignPlugsDto {
  @IsNotEmpty()
  @IsArray()
  plugIds: string[];
}
