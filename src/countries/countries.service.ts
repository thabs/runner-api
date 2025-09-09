import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCountryDto } from './dto/create-country.dto';
import { Country } from './entities/country.entity';

@Injectable()
export class CountriesService {
  constructor(@InjectRepository(Country) private countryRepo: Repository<Country>) {}

  async create(dto: CreateCountryDto): Promise<Country> {
    const country = this.countryRepo.create(dto);
    return this.countryRepo.save(country);
  }

  async findAll(): Promise<Country[]> {
    return this.countryRepo.find({ relations: ['provinces'] });
  }

  async findOne(id: string): Promise<Country> {
    const country = await this.countryRepo.findOne({
      where: { id },
      relations: ['provinces', 'provinces.cities', 'provinces.cities.suburbs'],
    });
    if (!country) throw new NotFoundException('Country not found');
    return country;
  }

  async remove(id: string) {
    const country = await this.countryRepo.findOne({ where: { id } });
    if (!country) {
      throw new NotFoundException('Country not found');
    }
    return this.countryRepo.remove(country);
  }
}
