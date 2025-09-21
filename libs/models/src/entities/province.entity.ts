import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { City } from './city.entity';
import { Country } from './country.entity';

@Entity('provinces')
export class Province {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @ManyToOne(() => Country, country => country.provinces, { onDelete: 'CASCADE' })
  country: Country;

  @OneToMany(() => City, city => city.province)
  cities: City[];
}
