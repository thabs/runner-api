import { Brand, MediaGroup, PaginatedResult } from '@app/models';
import { applyPagination } from '@app/utils';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MediasService } from 'src/medias/medias.service';
import { PlugsService } from 'src/plugs/plugs.service';
import { TagsService } from 'src/tags/tags.service';
import { Repository } from 'typeorm';
import { AssignTagsDto } from './dto/assign-tags.dto';
import { CreateBrandDto } from './dto/create-brand.dto';
import { FilterBrandDto } from './dto/filter-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand) private brandRepo: Repository<Brand>,
    private readonly mediaService: MediasService,
    private readonly tagService: TagsService,
    private readonly plugsService: PlugsService
  ) {}

  async create(createBrandDto: CreateBrandDto, file: Express.Multer.File) {
    const image = await this.mediaService.create(MediaGroup.BRAND, file);
    const brand = this.brandRepo.create({ ...createBrandDto, image });
    return this.brandRepo.save(brand);
  }

  async findAll(filter: FilterBrandDto): Promise<PaginatedResult<Brand>> {
    let qb = this.brandRepo
      .createQueryBuilder('brand')
      .leftJoinAndSelect('brand.image', 'image')
      .leftJoinAndSelect('brand.tags', 'tags'); // needed for relation search

    qb = applyPagination(qb, filter);

    // Apply department[] filter if provided
    if (filter.departments && filter.departments.length > 0) {
      qb.andWhere('brand.department IN (:...departments)', { departments: filter.departments });
    }

    const [data, total] = await qb.getManyAndCount();
    return new PaginatedResult<Brand>({
      data,
      total,
      page: filter.page,
      limit: filter.limit,
      totalPages: Math.ceil(total / filter.limit),
    });
  }

  async findOne(id: string) {
    const brand = await this.brandRepo.findOne({
      where: { id },
      relations: ['image', 'tags'],
    });

    if (!brand) throw new NotFoundException('Brand not found');
    return brand;
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    const { tagIds, ...body } = updateBrandDto;

    const brand = await this.brandRepo.findOne({
      where: { id },
      relations: ['tags'],
    });

    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    Object.assign(brand, body);
    if (tagIds) {
      const tags = await this.tagService.findByIds(tagIds);
      brand.tags = tags;
    }

    return this.brandRepo.save(brand);
  }

  async assignTags(id: string, assignTagsDto: AssignTagsDto) {
    const { tagIds } = assignTagsDto;
    const brand = await this.brandRepo.findOne({
      where: { id },
      relations: ['tags'],
    });

    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    const tags = await this.tagService.findByIds(tagIds);
    brand.tags = tags;

    return this.brandRepo.save(brand);
  }

  async activate(id: string, active: boolean) {
    const brand = await this.brandRepo.findOne({ where: { id } });
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    brand.isActive = active;
    return this.brandRepo.save(brand);
  }

  async remove(id: string) {
    const brand = await this.brandRepo.findOne({ where: { id } });
    if (!brand) throw new NotFoundException('Brand not found');

    await this.brandRepo.remove(brand);
  }
}
