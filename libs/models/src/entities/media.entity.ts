import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MediaGroup } from '../enums';
import { Brand } from './brand.entity';
import { Category } from './category.entity';
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
    enum: MediaGroup,
  })
  group: MediaGroup;

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

  @OneToOne(() => Category, category => category.image, {
    nullable: true,
  })
  category: Category;

  @OneToMany(() => Store, store => store.shoppingCentre, { nullable: true })
  stores: Store[];

  @ManyToOne(() => Plug, plug => plug.medias, { onDelete: 'CASCADE' })
  plug: Plug;
}
