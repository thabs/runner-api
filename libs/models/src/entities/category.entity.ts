import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Department } from '../enums';
import { Media } from './media.entity';
import { Plug } from './plug.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({
    type: 'enum',
    enum: Department,
  })
  department: Department;

  @OneToOne(() => Media, media => media.category, {
    cascade: true,
  })
  @JoinColumn()
  image: Media;

  @OneToMany(() => Plug, plug => plug.category)
  plugs: Plug[];
}
