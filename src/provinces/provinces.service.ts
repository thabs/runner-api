import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CountriesService } from 'countries/countries.service';
import { Repository } from 'typeorm';
import { CreateProvinceDto } from './dto/create-province.dto';
import { Province } from './entities/province.entity';

@Injectable()
export class ProvinceService {
  constructor(
    @InjectRepository(Province) private provinceRepo: Repository<Province>,
    private readonly countriesService: CountriesService
  ) {}

  async create(createProvinceDto: CreateProvinceDto): Promise<Province> {
    const { countryId, name } = createProvinceDto;
    const country = await this.countriesService.findOne(countryId);
    if (!country) throw new NotFoundException('Country not found');

    const province = this.provinceRepo.create({
      name,
      country,
    });

    return this.provinceRepo.save(province);
  }

  async findAll(): Promise<Province[]> {
    return this.provinceRepo.find({ relations: ['country', 'cities'] });
  }

  async findOne(id: string): Promise<Province> {
    const province = await this.provinceRepo.findOne({
      where: { id },
      relations: ['country', 'cities', 'cities.suburbs'],
    });
    if (!province) throw new NotFoundException('Province not found');
    return province;
  }

  async remove(id: string) {
    const province = await this.provinceRepo.findOne({ where: { id } });
    if (!province) {
      throw new NotFoundException('Province not found');
    }
    return this.provinceRepo.remove(province);
  }
}
