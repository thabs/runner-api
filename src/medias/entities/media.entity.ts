import { Brand } from 'brands/entities/brand.entity';
import { Plug } from 'plugs/entities/plug.entity';
import { ShoppingCentre } from 'shopping-centres/entities/shopping-centre.entity';
import { Store } from 'stores/entities/store.entity';
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MediaCategory } from './media-category';
import { MimeType } from './mime-type.enum';

@Entity()
export class Media {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: MimeType,
  })
  mimeType: MimeType;

  @Column({
    type: 'enum',
    enum: MimeType,
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
