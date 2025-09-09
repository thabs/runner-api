import { PartialType } from '@nestjs/swagger';
import { CreateShoppingCentreDto } from './create-shopping-centre.dto';

export class UpdateShoppingCentreDto extends PartialType(CreateShoppingCentreDto) {}
