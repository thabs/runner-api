import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MediaCategory } from '../enums/media-category.enum';
import { Brand } from './brand.entity';
import { Plug } from './plug.entity';
import { ShoppingCentre } from './shopping-centre.entity';
import { Store } from './store.entity';

@Entity()
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  mimeType: string;

  @Column({
    type: 'enum',
    enum: MediaCategory,
  })
  category: MediaCategory;

  @Column({ unique: true })
  url: string;

  @OneToOne(() => ShoppingCentre, shoppingCentre => shoppingCentre.image, {
    nullable: true,
  })
  shoppingCentre: ShoppingCentre;

  @OneToOne(() => Brand, brand => brand.image, {
    nullable: true,
  })
  brand: Brand;

  @OneToMany(() => Store, store => store.shoppingCentre, { nullable: true })
  stores: Store[];

  @ManyToOne(() => Plug, plug => plug.medias)
  plug: Plug;
}
