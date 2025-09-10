import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { FilterTagDto } from './dto/filter-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(@InjectRepository(Tag) private tagRepo: Repository<Tag>) {}

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const { name } = createTagDto;
    const tag = await this.tagRepo.findOne({ where: { name } });
    if (tag) throw new BadRequestException(`Tag with name '${name}' already exists.`);

    const newTag = this.tagRepo.create(createTagDto);
    return this.tagRepo.save(newTag);
  }

  async findAll(filter: FilterTagDto) {
    const { search, orderBy, orderDirection = 'ASC', page = 1, limit = 10 } = filter;

    const qb = this.tagRepo.createQueryBuilder('tag').leftJoin('tag.stores', 'store');
    // 👉 Select only the fields you need
    qb.select(['tag.id', 'tag.name', 'store.id', 'store.name']);

    // Apply search filter if provided
    if (search) {
      qb.where('LOWER(tag.name) LIKE :search', { search: `%${search.toLowerCase()}%` }).orWhere(
        'LOWER(store.name) LIKE :search',
        { search: `%${search.toLowerCase()}%` }
      );
    }

    // ✅ Apply dynamic ordering
    if (orderBy) {
      qb.orderBy(orderBy, orderDirection);
    }

    const [tags, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: tags,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Tag> {
    const tag = await this.tagRepo
      .createQueryBuilder('tag')
      .leftJoin('tag.stores', 'store')
      .select(['tag.id', 'tag.name', 'store.id', 'store.name'])
      .where('tag.id = :id', { id })
      .getOne();

    if (!tag) {
      throw new NotFoundException(`Tag with id '${id}' not found.`);
    }
    return tag;
  }

  async findByIds(tagIds: string[]): Promise<Tag[]> {
    const tags = await this.tagRepo.findBy({ id: In(tagIds) });
    return tags;
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    const tag = await this.tagRepo.findOne({ where: { id } });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }
    Object.assign(tag, updateTagDto);

    return this.tagRepo.save(tag);
  }

  async remove(id: string) {
    const tag = await this.tagRepo.findOne({ where: { id } });
    if (!tag) throw new NotFoundException(`Tag ${id} not found`);

    // Check if any store exists for this tag
    const hasStores = await this.tagRepo
      .createQueryBuilder('tag')
      .innerJoin('tag.stores', 'store')
      .where('tag.id = :id', { id })
      .getExists();

    if (hasStores) {
      throw new BadRequestException(
        `Cannot delete tag '${tag.name}', it is still assigned to one or more stores.`
      );
    }
    await this.tagRepo.remove(tag);
  }
}
