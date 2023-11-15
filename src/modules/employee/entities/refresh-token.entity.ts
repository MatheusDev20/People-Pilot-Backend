import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Employee } from './employee.entity';

@Entity()
export class RefreshTokens {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Employee, (employee) => employee.refreshToken, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  userId: Employee;

  @Column()
  token: string;

  @Column()
  expiration: string;
}
