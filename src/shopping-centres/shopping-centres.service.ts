import { MediaGroup, PaginatedResult, ShoppingCentre } from '@app/models';
import { applyPagination } from '@app/utils';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { AddressesService } from 'src/addresses/addresses.service';
import { MediasService } from 'src/medias/medias.service';
import { DataSource, Repository } from 'typeorm';
import { CreateShoppingCentreDto } from './dto/create-shopping-centre.dto';
import { FilterShoppingCenterDto } from './dto/filter-shopping-centre.dto';
import { FindNearbyDto } from './dto/find-nearby.dto';
import { LocationResponseDto } from './dto/location-response.dto';
import { UpdateShoppingCentreDto } from './dto/update-shopping-centre.dto';

@Injectable()
export class ShoppingCentresService {
  constructor(
    @InjectRepository(ShoppingCentre) private shoppingCentreRepo: Repository<ShoppingCentre>,
    private readonly addressService: AddressesService,
    private readonly mediasService: MediasService,
    @InjectDataSource() private dataSource: DataSource
  ) {}

  async create(createShoppingCentreDto: CreateShoppingCentreDto, file: Express.Multer.File) {
    const address = await this.addressService.create(createShoppingCentreDto.address);
    const image = await this.mediasService.create(MediaGroup.SHOPPING_CENTRE, file);

    const shoppingCentre = this.shoppingCentreRepo.create({
      ...createShoppingCentreDto,
      address,
      image,
    });

    return this.shoppingCentreRepo.save(shoppingCentre);
  }

  async findAll(filter: FilterShoppingCenterDto): Promise<PaginatedResult<ShoppingCentre>> {
    const { country, province, city, isActive } = filter;

    let qb = this.shoppingCentreRepo
      .createQueryBuilder('shoppingCentre')
      .leftJoinAndSelect('shoppingCentre.image', 'image')
      .leftJoinAndSelect('shoppingCentre.stores', 'stores')
      .leftJoinAndSelect('shoppingCentre.address', 'address');

    qb = applyPagination(qb, filter);

    if (country) qb.andWhere('address.country = :country', { country });
    if (province) qb.andWhere('address.province = :province', { province });
    if (city) qb.andWhere('address.city = :city', { city });
    if (isActive !== undefined) qb.andWhere('shoppingCentre.isActive = :isActive', { isActive });

    const [data, total] = await qb.getManyAndCount();
    return new PaginatedResult<ShoppingCentre>({
      data,
      total,
      page: filter.page,
      limit: filter.limit,
      totalPages: Math.ceil(total / filter.limit),
    });
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

  async findProvinces(country: string): Promise<string[]> {
    const result = await this.shoppingCentreRepo
      .createQueryBuilder('shoppingCentre')
      .leftJoinAndSelect('shoppingCentre.address', 'address')
      .select('DISTINCT address.province', 'province')
      .where('LOWER(address.country) = LOWER(:country)', { country })
      .orderBy('address.province', 'ASC')
      .getRawMany();

    return result.map(r => r.province);
  }

  async findCities(country: string, province: string): Promise<string[]> {
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
      relations: ['image', 'address', 'stores'],
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
    const shoppingCentre = await this.shoppingCentreRepo.findOne({
      where: { id },
    });

    if (!shoppingCentre) {
      throw new NotFoundException('Shopping centre not found');
    }

    Object.assign(shoppingCentre, updateShoppingCentreDto);
    return this.shoppingCentreRepo.save(shoppingCentre);
  }

  async updateImage(id: string, file: Express.Multer.File) {
    const shoppingCentre = await this.shoppingCentreRepo.findOne({
      where: { id },
      relations: ['image'],
    });

    if (!shoppingCentre) throw new NotFoundException('Shopping centre not found');

    const image = await this.mediasService.create(MediaGroup.SHOPPING_CENTRE, file);
    shoppingCentre.image = image;

    return this.shoppingCentreRepo.save(shoppingCentre);
  }

  async updateActive(id: string, active: boolean) {
    const shoppingCentre = await this.shoppingCentreRepo.findOne({ where: { id } });
    if (!shoppingCentre) {
      throw new NotFoundException('Shopping centre not found');
    }

    shoppingCentre.isActive = active;
    return this.shoppingCentreRepo.save(shoppingCentre);
  }

  async remove(id: string) {
    const shoppingCentre = await this.shoppingCentreRepo.findOne({ where: { id } });
    if (!shoppingCentre) throw new NotFoundException('Shopping centre not found');

    await this.shoppingCentreRepo.remove(shoppingCentre);
  }
}
