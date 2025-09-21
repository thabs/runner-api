import { Brand } from 'brands/entities/brand.entity';
import { Media } from 'medias/entities/media.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('plugs')
export class Plug {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title?: string;

  @Column()
  description?: string;

  @OneToMany(() => Media, media => media.plug, { nullable: true })
  medias: Media[];

  @ManyToOne(() => Brand, brand => brand.plugs)
  brand: Brand;

  @Column({ default: true })
  isActive: boolean;
}
