import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'users/entities/user.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address) private addressRepository: Repository<Address>,
  ) {}

  async create(createAddressDto: CreateAddressDto): Promise<Address> {
    const { longitude, latitude, ...body } = createAddressDto;

    const address = this.addressRepository.create({
      ...body,
      coordinates: { latitude, longitude },
    });

    return this.addressRepository.save(address);
  }

  async createUserAddress(createAddressDto: CreateAddressDto,currentUser: User): Promise<Address> {
    const { longitude, latitude, ...body } = createAddressDto;

    const address = this.addressRepository.create({
      ...body,
      coordinates: { latitude, longitude },
      user: currentUser,
    });

    return this.addressRepository.save(address);
  }

  async update(id: string,updateAddressDto: UpdateAddressDto): Promise<Address> {
    const address = await this.addressRepository.findOne({ where: { id } });
    if (!address) {
      throw new NotFoundException('address not found');
    }
    const { longitude, latitude, ...body } = updateAddressDto;
    if (latitude && longitude) {
      address.coordinates = { latitude, longitude };
    }
    Object.assign(address, body);

    return this.addressRepository.save(address);
  }

  async remove(id: string) {
    const address = await this.addressRepository.findOne({ where: { id } });
    if (!address) {
      throw new NotFoundException('address not found');
    }
    return this.addressRepository.remove(address);
  }
}
