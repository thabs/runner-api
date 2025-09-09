import { Province } from 'provinces/entities/province.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cities')
export class City {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Province, province => province.cities, { onDelete: 'CASCADE' })
  province: Province;
}
