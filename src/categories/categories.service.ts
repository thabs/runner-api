import { Category, MediaGroup, PaginatedResult } from '@app/models';
import { applyPagination } from '@app/utils';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MediasService } from 'src/medias/medias.service';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { FilterCategoryDto } from './dto/filter-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    private readonly mediaService: MediasService
  ) {}

  async create(createCategoryDto: CreateCategoryDto, file: Express.Multer.File) {
    const { name } = createCategoryDto;
    const category = await this.categoryRepo.findOne({ where: { name } });

    if (category) throw new BadRequestException(`Category with name '${name}' already exists.`);

    const image = await this.mediaService.create(MediaGroup.CATEGORY, file);
    const newCategory = this.categoryRepo.create({ ...createCategoryDto, image });
    return this.categoryRepo.save(newCategory);
  }

  async findAll(filter: FilterCategoryDto): Promise<PaginatedResult<Category>> {
    let qb = this.categoryRepo
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.image', 'image');

    qb = applyPagination(qb, filter);

    // Apply department[] filter if provided
    if (filter.departments && filter.departments.length > 0) {
      qb.andWhere('category.department IN (:...departments)', { departments: filter.departments });
    }

    const [data, total] = await qb.getManyAndCount();
    return new PaginatedResult<Category>({
      data,
      total,
      page: filter.page,
      limit: filter.limit,
      totalPages: Math.ceil(total / filter.limit),
    });
  }

  async findOne(id: string) {
    const category = await this.categoryRepo.findOne({
      where: { id },
      relations: ['image', 'tags'],
    });

    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');

    Object.assign(category, updateCategoryDto);
    return this.categoryRepo.save(category);
  }

  async remove(id: string) {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');

    await this.categoryRepo.remove(category);
  }
}
