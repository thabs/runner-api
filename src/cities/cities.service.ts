import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProvinceService } from 'provinces/provinces.service';
import { Repository } from 'typeorm';
import { CreateCityDto } from './dto/create-city.dto';
import { City } from './entities/city.entity';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City) private cityRepo: Repository<City>,
    private readonly provincesService: ProvinceService
  ) {}

  async create(createCityDto: CreateCityDto): Promise<City> {
    const { provinceId, name } = createCityDto;

    const province = await this.provincesService.findOne(provinceId);
    if (!province) throw new NotFoundException('Province not found');

    const city = this.cityRepo.create({
      name,
      province,
    });
    return this.cityRepo.save(city);
  }

  async findAll(): Promise<City[]> {
    return this.cityRepo.find({ relations: ['province', 'suburbs'] });
  }

  async findOne(id: string): Promise<City> {
    const city = await this.cityRepo.findOne({
      where: { id },
      relations: ['province', 'suburbs'],
    });
    if (!city) throw new NotFoundException('City not found');
    return city;
  }

  async remove(id: string) {
    const city = await this.cityRepo.findOne({ where: { id } });
    if (!city) {
      throw new NotFoundException('City not found');
    }
    return this.cityRepo.remove(city);
  }
}
