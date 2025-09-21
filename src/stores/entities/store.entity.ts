import { Brand } from 'brands/entities/brand.entity';
import { ShoppingCentre } from 'shopping-centres/entities/shopping-centre.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
