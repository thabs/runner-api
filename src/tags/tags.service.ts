import { PaginatedResult, Tag } from '@app/models';
import { applyPagination } from '@app/utils';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { FilterTagDto } from './dto/filter-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

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

  async findAll(filter: FilterTagDto): Promise<PaginatedResult<Tag>> {
    let qb = this.tagRepo.createQueryBuilder('tag').leftJoinAndSelect('tag.brands', 'brands');
    qb = applyPagination(qb, filter);

    const [data, total] = await qb.getManyAndCount();
    return new PaginatedResult<Tag>({
      data,
      total,
      page: filter.page,
      limit: filter.limit,
      totalPages: Math.ceil(total / filter.limit),
    });
  }

  async findOne(id: string): Promise<Tag> {
    const tag = await this.tagRepo.findOne({
      where: { id },
      relations: ['brands'],
    });

    if (!tag) throw new NotFoundException('Tag not found');
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
    const tag = await this.tagRepo.findOne({
      where: { id },
      relations: ['brands'],
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    if (tag.brands.length > 0) {
      throw new BadRequestException(`Cannot delete tag: ${tag.name}, it is still linked to brands`);
    }

    return this.tagRepo.remove(tag);
  }
}
