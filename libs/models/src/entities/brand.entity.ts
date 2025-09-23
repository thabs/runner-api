import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Department } from '../enums/department.enum';
import { Media } from './media.entity';
import { Plug } from './plug.entity';
import { Store } from './store.entity';
import { Tag } from './tag.entity';

@Entity()
export class Brand {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  website?: string;

  @Column()
  facebook?: string;

  @Column({
    type: 'enum',
    enum: Department,
    array: true,
  })
  departments: Department[];

  @OneToOne(() => Media, media => media.brand, {
    cascade: true,
  })
  @JoinColumn()
  image: Media;

  @OneToMany(() => Store, store => store.brand)
  stores: Store[];

  @OneToMany(() => Plug, plug => plug.brand)
  plugs: Plug[];

  @ManyToMany(() => Tag, tag => tag.brands, { cascade: true })
  @JoinTable()
  tags: Tag[];

  @Column({ default: true })
  isActive: boolean;
}
