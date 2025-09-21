import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Province } from './province.entity';

@Entity('cities')
export class City {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Province, province => province.cities, { onDelete: 'CASCADE' })
  province: Province;
}
