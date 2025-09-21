import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Address } from './address.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  mobileNumber: string;

  @Column()
  password: string;

  @OneToMany(() => Address, address => address.user, { cascade: true })
  addresses: Address[];

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: true })
  isActive: boolean;
}
