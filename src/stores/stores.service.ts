import { PaginatedResult, Store } from '@app/models';
import { applyPagination } from '@app/utils';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BrandsService } from 'src/brands/brands.service';
import { ShoppingCentresService } from 'src/shopping-centres/shopping-centres.service';
import { In, Repository } from 'typeorm';
import { CreateStoreDto } from './dto/create-store.dto';
import { FilterStoreDto } from './dto/filter-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store) private storeRepo: Repository<Store>,
    private readonly brandsService: BrandsService,
    private readonly shoppingCentreService: ShoppingCentresService
  ) {}

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const { brandId, shoppingCentreId, ...body } = createStoreDto;

    const shoppingCentre = await this.shoppingCentreService.findById(shoppingCentreId);
    const brand = await this.brandsService.findById(brandId);

    const store = this.storeRepo.create({
      ...body,
      brand,
      shoppingCentre,
    });

    return this.storeRepo.save(store);
  }

  async findAll(filter: FilterStoreDto) {
    const { brandId, shoppingCentreId, isActive } = filter;

    let qb = this.storeRepo
      .createQueryBuilder('store')
      .leftJoinAndSelect('store.brand', 'brand')
      .leftJoinAndSelect('store.shoppingCentre', 'shoppingCentre');

    qb = applyPagination(qb, filter);
    if (brandId) qb.andWhere('brand.id = :brandId', { brandId });
    if (shoppingCentreId)
      qb.andWhere('shoppingCentre.id = :shoppingCentreId', { shoppingCentreId });
    if (isActive !== undefined) qb.andWhere('store.isActive = :isActive', { isActive });

    const [data, total] = await qb.getManyAndCount();
    return new PaginatedResult<Store>({
      data,
      total,
      page: filter.page,
      limit: filter.limit,
      totalPages: Math.ceil(total / filter.limit),
    });
  }

  async findOne(id: string): Promise<Store> {
    const store = await this.storeRepo.findOne({
      where: { id },
      relations: ['brand', 'shoppingCentre'],
    });
    if (!store) throw new NotFoundException('Store not found');

    return store;
  }

  async findByIds(storeIds: string[]): Promise<Store[]> {
    const stores = await this.storeRepo.findBy({ id: In(storeIds) });
    return stores;
  }

  async update(id: string, updateStoreDto: UpdateStoreDto) {
    const { brandId, shoppingCentreId, ...body } = updateStoreDto;

    const store = await this.storeRepo.findOne({
      where: { id },
      relations: ['brand', 'shoppingCentre'],
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    Object.assign(store, body);
    if (brandId) {
      const brand = await this.brandsService.findById(brandId);
      store.brand = brand;
    }

    if (shoppingCentreId) {
      const shoppingCentre = await this.shoppingCentreService.findById(shoppingCentreId);
      store.shoppingCentre = shoppingCentre;
    }

    return this.storeRepo.save(store);
  }

  async updateActive(id: string, isActive: boolean) {
    const store = await this.storeRepo.findOne({ where: { id } });
    if (!store) {
      throw new NotFoundException('Store not found');
    }

    store.isActive = isActive;
    return this.storeRepo.save(store);
  }

  async setStoresActive(storeIds: string[], isActive: boolean) {
    await this.storeRepo
      .createQueryBuilder()
      .update(Store)
      .set({ isActive })
      .whereInIds(storeIds)
      .execute();

    return { updated: storeIds.length, isActive };
  }

  async remove(id: string) {
    const store = await this.storeRepo.findOne({ where: { id } });
    if (!store) throw new NotFoundException('Store not found');

    await this.storeRepo.remove(store);
  }
}
