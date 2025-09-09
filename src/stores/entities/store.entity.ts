import { Plug } from 'plugs/entities/plug.entity';
import { ShoppingCentre } from 'shopping-centres/entities/shopping-centre.entity';
import { Tag } from 'tags/entities/tag.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Category } from './category.enum';

@Entity()
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: Category,
    array: true,
  })
  categories: Category[];

  @Column()
  contactPerson?: string;

  @Column()
  contactNumber?: string;

  @Column()
  website?: string;

  @Column()
  facebook?: string;

  @ManyToOne(() => ShoppingCentre, shoppingCentre => shoppingCentre.stores)
  shoppingCentre: ShoppingCentre;

  @ManyToMany(() => Tag, tag => tag.stores, { cascade: true })
  @JoinTable()
  tags: Tag[];

  @OneToMany(() => Plug, plug => plug.store)
  plugs: Plug[];

  @Column({ default: true })
  isActive: boolean;
}
