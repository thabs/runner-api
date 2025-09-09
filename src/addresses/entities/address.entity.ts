import { ShoppingCentre } from 'shopping-centres/entities/shopping-centre.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'users/entities/user.entity';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  street: string;

  @Column()
  businessName?: string;

  @Column()
  complex?: string;

  @Column()
  suburb: string;

  @Column()
  city: string;

  @Column()
  province?: string;

  @Column()
  country: string;

  @Column()
  postalCode: string;

  @Column({
    type: 'geometry',
    spatialFeatureType: 'Point',
    srid: 4326,
    transformer: {
      to: (value: { latitude: number; longitude: number }) =>
        value ? `POINT(${value.longitude} ${value.latitude})` : null,

      from: (value: string): { latitude: number; longitude: number } | null => {
        if (!value) return null;
        const [lon, lat] = value
          .replace('POINT(', '')
          .replace(')', '')
          .split(' ')
          .map(Number);
        return { latitude: lat, longitude: lon };
      },
    },
  })
  coordinates: { latitude: number; longitude: number };

  @ManyToOne(() => User, (user) => user.addresses, { nullable: true })
  user: User;

  @OneToOne(() => ShoppingCentre, (shoppingCentre) => shoppingCentre.address, {
    nullable: true,
  })
  shoppingCentre: ShoppingCentre;
}
