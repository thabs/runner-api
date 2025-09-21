import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Brand } from './brand.entity';
import { Media } from './media.entity';

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
