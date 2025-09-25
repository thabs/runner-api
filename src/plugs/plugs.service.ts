import { MediaGroup, PaginatedResult, Plug } from '@app/models';
import { applyPagination } from '@app/utils';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BrandsService } from 'src/brands/brands.service';
import { CategoriesService } from 'src/categories/categories.service';
import { MediaOrderDto } from 'src/medias/dto/media-order.dto';
import { MediasService } from 'src/medias/medias.service';
import { In, Repository } from 'typeorm';
import { CreatePlugDto } from './dto/create-plug.dto';
import { FilterPlugDto } from './dto/filter-plug.dto';
import { UpdatePlugDto } from './dto/update-plug.dto';

@Injectable()
export class PlugsService {
  constructor(
    @InjectRepository(Plug) private plugRepo: Repository<Plug>,
    private readonly brandsService: BrandsService,
    private readonly categoriesService: CategoriesService,
    private readonly mediasService: MediasService
  ) {}

  async create(createPlugDto: CreatePlugDto, files: Express.Multer.File[]) {
    const { categoryId, brandId, ...body } = createPlugDto;

    const brand = await this.brandsService.findOne(brandId);
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    const category = await this.categoriesService.findOne(categoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Verify if brand can accept the departments
    if (!brand.departments.includes(category.department)) {
      throw new BadRequestException(`Brand does not allow department ${category.department}`);
    }

    const images = await Promise.all(
      files.map(file => this.mediasService.create(MediaGroup.PLUGS, file))
    );

    const plug = this.plugRepo.create({
      ...body,
      brand,
      category,
      images,
    });

    return this.plugRepo.save(plug);
  }

  async findAll(filter: FilterPlugDto): Promise<PaginatedResult<Plug>> {
    let qb = this.plugRepo
      .createQueryBuilder('plug')
      .leftJoinAndSelect('plug.brand', 'brand')
      .leftJoinAndSelect('plug.category', 'category')
      .leftJoinAndSelect('plug.images', 'images');

    qb = applyPagination(qb, filter);

    // Apply filters
    if (filter.brandIds && filter.brandIds.length > 0) {
      qb.andWhere('plug.brand.id IN (:...brandIds)', { brandIds: filter.brandIds });
    }

    if (filter.categoryIds && filter.categoryIds.length > 0) {
      qb.andWhere('plug.category.id IN (:...categoryIds)', { categoryIds: filter.categoryIds });
    }

    if (filter.isActive !== undefined) {
      qb.andWhere('plug.isActive = :isActive', { isActive: filter.isActive });
    }

    const [data, total] = await qb.getManyAndCount();
    return new PaginatedResult<Plug>({
      data,
      total,
      page: filter.page,
      limit: filter.limit,
      totalPages: Math.ceil(total / filter.limit),
    });
  }

  async findOne(id: string) {
    const plug = await this.plugRepo.findOne({
      where: { id },
      relations: ['brand', 'category', 'images'],
      order: { images: { order: 'ASC' } },
    });

    if (!plug) throw new NotFoundException('Plug not found');
    return plug;
  }

  async findByIds(plugIds: string[]): Promise<Plug[]> {
    const plugs = await this.plugRepo.findBy({ id: In(plugIds) });
    return plugs;
  }

  async update(id: string, updatePlugDto: UpdatePlugDto) {
    const { categoryId, brandId, ...body } = updatePlugDto;

    if (!brandId) {
      throw new NotFoundException('Brand ID is required');
    }
    const brand = await this.brandsService.findOne(brandId);
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    if (!categoryId) {
      throw new NotFoundException('Category ID is required');
    }
    const category = await this.categoriesService.findOne(categoryId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const plug = await this.plugRepo.findOne({ where: { id } });
    if (!plug) {
      throw new NotFoundException('Plug not found');
    }

    Object.assign(plug, { ...body, brand, category });
    return this.plugRepo.save(plug);
  }

  async updateImages(id: string, files: Express.Multer.File[]) {
    const plug = await this.plugRepo.findOne({
      where: { id },
      relations: ['images'],
    });
    if (!plug) throw new NotFoundException('Plug not found');

    const images = await Promise.all(
      files.map(file => this.mediasService.create(MediaGroup.PLUGS, file))
    );
    plug.images = images;

    return this.plugRepo.save(plug);
  }

  async updateImagesOrder(id: string, imagesOrder: MediaOrderDto[]) {
    const plug = await this.plugRepo.findOne({
      where: { id },
      relations: ['images'],
    });
    if (!plug) throw new NotFoundException('Plug not found');

    const plugImageIds = new Set(plug.images.map(i => i.id));
    const allExist = imagesOrder.every(image => plugImageIds.has(image.id));

    if (!allExist) throw new BadRequestException('Invalid plug images provided');
    return this.mediasService.updateMediasOrder(imagesOrder);
  }

  async updateActive(id: string, isActive: boolean) {
    const plug = await this.plugRepo.findOne({ where: { id } });
    if (!plug) {
      throw new NotFoundException('Plug not found');
    }

    plug.isActive = isActive;
    return this.plugRepo.save(plug);
  }

  async remove(id: string) {
    const plug = await this.plugRepo.findOne({ where: { id } });
    if (!plug) throw new NotFoundException('Plug not found');

    await this.plugRepo.remove(plug);
  }
}
