import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Brand } from './brand.entity';
import { Category } from './category.entity';
import { Media } from './media.entity';

@Entity('plugs')
export class Plug {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToOne(() => Brand, brand => brand.plugs)
  brand: Brand;

  @ManyToOne(() => Category, category => category.plugs)
  category: Category;

  @OneToMany(() => Media, media => media.plug, {
    nullable: true,
    cascade: true,
    orphanedRowAction: 'delete', // auto delete removed media
  })
  images: Media[];

  @Column({ default: true })
  isActive: boolean;
}
