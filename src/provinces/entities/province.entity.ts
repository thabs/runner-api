import { City } from 'cities/entities/city.entity';
import { Country } from 'countries/entities/country.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('provinces')
export class Province {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @ManyToOne(() => Country, (country) => country.provinces, { onDelete: 'CASCADE' })
  country: Country;

  @OneToMany(() => City, (city) => city.province)
  cities: City[];
}


