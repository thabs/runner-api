import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreatePlugDto } from './dto/create-plug.dto';
import { UpdatePlugDto } from './dto/update-plug.dto';
import { Plug } from './entities/plug.entity';

@Injectable()
export class PlugsService {
  constructor(@InjectRepository(Plug) private plugRepo: Repository<Plug>) {}

  create(createPlugDto: CreatePlugDto) {
    return 'This action adds a new plug';
  }

  findAll() {
    return `This action returns all plugs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} plug`;
  }

  async findByIds(plugIds: string[]): Promise<Plug[]> {
    const tags = await this.plugRepo.findBy({ id: In(plugIds) });
    return tags;
  }

  update(id: number, updatePlugDto: UpdatePlugDto) {
    return `This action updates a #${id} plug`;
  }

  remove(id: number) {
    return `This action removes a #${id} plug`;
  }
}
