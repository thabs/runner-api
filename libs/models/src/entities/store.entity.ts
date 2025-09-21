import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Brand } from './brand.entity';
import { ShoppingCentre } from './shopping-centre.entity';

@Entity()
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  contactPerson?: string;

  @Column()
  contactNumber?: string;

  @ManyToOne(() => Brand, brand => brand.stores)
  brand: Brand;

  @ManyToOne(() => ShoppingCentre, shoppingCentre => shoppingCentre.stores)
  shoppingCentre: ShoppingCentre;

  @Column({ default: true })
  isActive: boolean;
}
