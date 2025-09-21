import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Address } from './address.entity';
import { Media } from './media.entity';
import { Store } from './store.entity';

@Entity('shopping_centres')
export class ShoppingCentre {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToOne(() => Address, address => address.shoppingCentre, {
    cascade: true,
  })
  @JoinColumn()
  address: Address;

  @OneToOne(() => Media, media => media.shoppingCentre, {
    cascade: true, // allows auto insert/update
  })
  @JoinColumn()
  image: Media;

  @OneToMany(() => Store, store => store.shoppingCentre, { nullable: true })
  stores: Store[];

  @Column({ default: true })
  isActive: boolean;
}
