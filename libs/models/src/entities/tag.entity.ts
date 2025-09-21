import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Brand } from './brand.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Brand, brand => brand.tags)
  brands: Brand[];
}
