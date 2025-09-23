import { IsArray, IsNotEmpty } from 'class-validator';

export class AssignTagsDto {
  @IsNotEmpty()
  @IsArray()
  tagIds: string[];
}
