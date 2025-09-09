import { Media } from 'medias/entities/media.entity';
import { Store } from 'stores/entities/store.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('plugs')
export class Plug {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title?: string;

  @Column()
  description?: string;

  @OneToMany(() => Media, (media) => media.plug, { nullable: true })
  medias: Media[];

  @ManyToOne(() => Store, (store) => store.plugs)
  store: Store;

  @Column({ default: true })
  isActive: boolean;
}
