import { Body, Controller, Delete, Param, Put } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  /*@Post('user')
  createUserAddress(@Body() createAddressDto: CreateAddressDto) {
    return this.addressesService.createUserAddress(createAddressDto);
  }

  @Get('user')
  findAll() {
    return this.addressesService.findAll();
  }*/

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressesService.update(id, updateAddressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addressesService.remove(id);
  }
}
