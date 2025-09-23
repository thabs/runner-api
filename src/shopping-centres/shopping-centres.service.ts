import { Address, ShoppingCentre } from '@app/models';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { CreateAddressDto } from 'src/addresses/dto/create-address.dto';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CreateShoppingCentreDto } from './dto/create-shopping-centre.dto';
import { FilterShoppingCenterDto } from './dto/filter-shopping-centre.dto';
import { FindNearbyDto } from './dto/find-nearby.dto';
import { LocationResponseDto } from './dto/location-response.dto';
import { UpdateShoppingCentreDto } from './dto/update-shopping-centre.dto';

@Injectable()
export class ShoppingCentresService {
  constructor(
    @InjectRepository(ShoppingCentre) private shoppingCentreRepo: Repository<ShoppingCentre>,
    @InjectDataSource() private dataSource: DataSource
  ) {}

  async create(createShoppingCentreDto: CreateShoppingCentreDto): Promise<ShoppingCentre> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { name, address } = createShoppingCentreDto;
      await this.updateAdressFilters(queryRunner.manager, address);

      // ✅ Create Address
      const newAddress = queryRunner.manager.create(Address, address);
      const savedAddress = await queryRunner.manager.save(Address, newAddress);

      // ✅ Create Shopping centre
      const shoppingCentre = queryRunner.manager.create(ShoppingCentre, {
        name,
        address: savedAddress,
      });
      const savedShoppingCentre = await queryRunner.manager.save(ShoppingCentre, shoppingCentre);

      await queryRunner.commitTransaction();
      return savedShoppingCentre;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(filter: FilterShoppingCenterDto) {
    const {
      country,
      province,
      city,
      page = 1,
      limit = 10,
      search,
      orderBy,
      orderDirection = 'ASC',
    } = filter;

    const qb = this.shoppingCentreRepo
      .createQueryBuilder('shoppingCentre')
      .leftJoinAndSelect('shoppingCentre.address', 'address');

    if (country) qb.andWhere('address.country = :country', { country });
    if (province) qb.andWhere('address.province = :province', { province });
    if (city) qb.andWhere('address.city = :city', { city });

    if (search) {
      qb.andWhere(
        '(shoppingCentre.name ILIKE :search OR address.suburb ILIKE :search OR address.city ILIKE :search)',
        {
          search: `%${search}%`,
        }
      );
    }

    // ✅ Apply dynamic ordering
    if (orderBy) {
      qb.orderBy(orderBy, orderDirection);
    }

    qb.skip((page - 1) * limit).take(limit);
    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findNearby(findNearbyDto: FindNearbyDto): Promise<LocationResponseDto[]> {
    const { latitude, longitude, radiusKm } = findNearbyDto;

    const { entities, raw } = await this.shoppingCentreRepo
      .createQueryBuilder('shoppingCentre')
      .innerJoinAndSelect('shoppingCentre.address', 'address')
      .addSelect(
        `ST_Distance(
        address.coordinates,
        ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)
      )`,
        'distance'
      )
      .where(
        `ST_DWithin(
        address.coordinates,
        ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326),
        :radiusMeters
      )`
      )
      .setParameters({
        longitude,
        latitude,
        radiusMeters: radiusKm * 1000,
      })
      .orderBy('distance', 'ASC')
      .getRawAndEntities();

    return entities.map((shoppingCentre, i) => ({
      id: shoppingCentre.id,
      name: shoppingCentre.name,
      latitude: shoppingCentre.address.coordinates.latitude,
      longitude: shoppingCentre.address.coordinates.longitude,
      distanceKm: Number(raw[i].distance) / 1000, // convert meters → km
    }));
  }

  async findCountries(): Promise<string[]> {
    const result = await this.shoppingCentreRepo
      .createQueryBuilder('shoppingCentre')
      .leftJoinAndSelect('shoppingCentre.address', 'address')
      .select('DISTINCT address.country', 'country')
      .orderBy('address.country', 'ASC')
      .getRawMany();

    return result.map(r => r.country);
  }

  async findProvincesByCountry(country: string): Promise<string[]> {
    const result = await this.shoppingCentreRepo
      .createQueryBuilder('shoppingCentre')
      .leftJoinAndSelect('shoppingCentre.address', 'address')
      .select('DISTINCT address.province', 'province')
      .where('LOWER(address.country) = LOWER(:country)', { country })
      .orderBy('address.province', 'ASC')
      .getRawMany();

    return result.map(r => r.province);
  }

  async findCitiesByProvince(country: string, province: string): Promise<string[]> {
    const result = await this.shoppingCentreRepo
      .createQueryBuilder('shoppingCentre')
      .leftJoinAndSelect('shoppingCentre.address', 'address')
      .select('DISTINCT address.city', 'city')
      .where('LOWER(address.country) = LOWER(:country)', { country })
      .andWhere('LOWER(address.province) = LOWER(:province)', { province })
      .orderBy('address.city', 'ASC')
      .getRawMany();

    return result.map(r => r.city);
  }

  async findOne(id: string): Promise<ShoppingCentre> {
    const shoppingCentre = await this.shoppingCentreRepo.findOne({
      where: { id },
      relations: ['address', 'stores'],
    });
    if (!shoppingCentre) throw new NotFoundException('Shopping centre not found');
    return shoppingCentre;
  }

  async findById(id: string): Promise<ShoppingCentre> {
    const shoppingCentre = await this.shoppingCentreRepo.findOne({
      where: { id },
    });
    if (!shoppingCentre) throw new NotFoundException('Shopping centre not found');
    return shoppingCentre;
  }

  async update(
    id: string,
    updateShoppingCentreDto: UpdateShoppingCentreDto
  ): Promise<ShoppingCentre> {
    const { name, address } = updateShoppingCentreDto;

    return this.dataSource.transaction(async manager => {
      const shoppingCentre = await this.shoppingCentreRepo.findOne({
        where: { id },
      });

      if (!shoppingCentre) {
        throw new NotFoundException('Shopping centre not found');
      }

      if (name) {
        shoppingCentre.name = name;
      }

      if (address) {
        await this.updateAdressFilters(manager, address);
        Object.assign(shoppingCentre.address, address);
      }

      return await manager.save(shoppingCentre);
    });
  }

  async activate(id: string, active: boolean) {
    const shoppingCentre = await this.shoppingCentreRepo.findOne({ where: { id } });
    if (!shoppingCentre) {
      throw new NotFoundException('Shopping centre not found');
    }

    shoppingCentre.isActive = active;
    return this.shoppingCentreRepo.save(shoppingCentre);
  }

  remove(id: string) {
    return this.shoppingCentreRepo.delete(id);
  }

  //!TODO: We saving address fields as string to be used in filtering, changing names are not catered for, maybe we can use scripts to udate changing names in future?
  async updateAdressFilters(manager: EntityManager, addressDto: CreateAddressDto) {
    try {
      // ✅ Ensure Country exists
      let country = await manager.findOne(Country, {
        where: { name: addressDto.country },
      });
      if (!country) {
        const newCountry = manager.create(Country, { name: addressDto.country });
        country = await manager.save(Country, newCountry);
      }

      // ✅ Ensure Province exists
      let province = await manager.findOne(Province, {
        where: { name: addressDto.province, country },
      });
      if (!province) {
        const newProvince = manager.create(Province, {
          name: addressDto.province,
          country,
        });
        province = await manager.save(Province, newProvince);
      }

      // ✅ Ensure City exists
      let city = await manager.findOne(City, {
        where: { name: addressDto.city, province },
      });
      if (!city) {
        const newCity = manager.create(City, { name: addressDto.city, province });
        city = await manager.save(City, newCity);
      }
    } catch (err) {
      throw err;
    }
  }
}
