import { Address } from 'addresses/entities/address.entity';
import { Media } from 'medias/entities/media.entity';
import { Store } from 'stores/entities/store.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

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
    cascade: true,
  })
  @JoinColumn()
  image: Media;

  @OneToMany(() => Store, store => store.shoppingCentre, { nullable: true })
  stores: Store[];

  @Column({ default: true })
  isActive: boolean;
}
