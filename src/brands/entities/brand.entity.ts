import { Media } from 'medias/entities/media.entity';
import { Plug } from 'plugs/entities/plug.entity';
import { Store } from 'stores/entities/store.entity';
import { Tag } from 'tags/entities/tag.entity';
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
import { Category } from './category.enum';

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
    enum: Category,
    array: true,
  })
  categories: Category[];

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
