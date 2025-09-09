import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlugsService } from 'plugs/plugs.service';
import { ShoppingCentresService } from 'shopping-centres/shopping-centres.service';
import { TagsService } from 'tags/tags.service';
import { Repository } from 'typeorm';
import { AssignPlugsDto } from './dto/assign-plugs.dto';
import { AssignTagsDto } from './dto/assign-tags.dto';
import { CreateStoreDto } from './dto/create-store.dto';
import { FilterStoreDto } from './dto/filter-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { Store } from './entities/store.entity';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store) private storeRepo: Repository<Store>,
    private readonly shoppingCentreService: ShoppingCentresService,
    private readonly tagService: TagsService,
    private readonly plugsService: PlugsService
  ) {}

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const { shoppingCentreId, ...body } = createStoreDto;
    const shoppingCentre = await this.shoppingCentreService.findById(shoppingCentreId);
    const store = this.storeRepo.create({
      ...body,
      shoppingCentre,
    });

    return this.storeRepo.save(store);
  }

  async assignTagsToStore(id: string, assignTagsDto: AssignTagsDto) {
    const { tagIds } = assignTagsDto;
    const store = await this.storeRepo.findOne({
      where: { id },
      relations: ['tags'],
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    const tags = await this.tagService.findByIds(tagIds);
    store.tags = tags;

    return this.storeRepo.save(store);
  }

  async assignPlugsToStore(id: string, assignPlugsDto: AssignPlugsDto) {
    const { plugIds } = assignPlugsDto;
    const store = await this.storeRepo.findOne({
      where: { id },
      relations: ['plugs'],
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    const plugs = await this.plugsService.findByIds(plugIds);
    store.plugs = plugs;

    return this.storeRepo.save(store);
  }

  async findAll(filter: FilterStoreDto) {
    const { categories, search, isActive, orderBy, orderDirection = 'ASC', page = 1, limit = 10 } = filter;

    const qb = this.storeRepo
      .createQueryBuilder('store')
      .leftJoinAndSelect('store.shoppingCentre', 'shoppingCentre')
      .leftJoinAndSelect('store.tags', 'tag')
      .leftJoinAndSelect('store.plugs', 'plug');

    // Apply search filter if provided
    if (search) {
      qb.where('LOWER(store.name) LIKE :search', { search: `%${search.toLowerCase()}%` })
        .orWhere('LOWER(shoppingCentre.name) LIKE :search', { search: `%${search.toLowerCase()}%` })
        .orWhere('LOWER(tag.name) LIKE :search', { search: `%${search.toLowerCase()}%` })
        .orWhere('LOWER(plug.name) LIKE :search', { search: `%${search.toLowerCase()}%` });
    }

    // 🎯 Filter by specific categories provided
    if (categories?.length) {
      qb.andWhere('store.categories && :categories', { categories });
    }

    if (isActive !== undefined) {
      qb.andWhere('store.isActive = :isActive', { isActive });
    }

    // ✅ Apply dynamic ordering
    if (orderBy) {
      qb.orderBy(orderBy, orderDirection);
    }

    const [stores, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: stores,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Store> {
    const store = await this.storeRepo.findOne({
      where: { id },
      relations: ['shoppingCentre', 'tags', 'plugs'],
    });
    if (!store) throw new NotFoundException('Store not found');

    return store;
  }

  async update(id: string, updateStoreDto: UpdateStoreDto) {
    const { shoppingCentreId, ...body } = updateStoreDto;

    const store = await this.storeRepo.findOne({
      where: { id },
      relations: ['shoppingCentre'],
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    Object.assign(store, body);
    if (shoppingCentreId) {
      const shoppingCentre = await this.shoppingCentreService.findById(shoppingCentreId);
      store.shoppingCentre = shoppingCentre;
    }
    return this.storeRepo.save(store);
  }

  async remove(id: string) {
    const store = await this.storeRepo.findOne({ where: { id } });
    if (!store) throw new NotFoundException(`Store ${id} not found`);

    // Check if any store exists for this tag
    const hasPlugs = await this.storeRepo
      .createQueryBuilder('store')
      .innerJoin('store.plugs', 'plug')
      .where('store.id = :id', { id })
      .getExists();

    if (hasPlugs) {
      throw new BadRequestException(`Cannot delete store '${store.name}', it is still assigned to one or more plugs.`);
    }
    await this.storeRepo.remove(store);
  }
}
