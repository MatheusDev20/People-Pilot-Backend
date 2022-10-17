import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Department } from '../departments/department.entity';
import { Role } from '../roles/role.entity';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @OneToOne(() => Department)
  @JoinColumn({ name: 'department_id' })
  department_id: number;

  @Column()
  department_name: string;

  @Column()
  role: string;

  @UpdateDateColumn()
  updated_at: Date;

  @CreateDateColumn()
  created_at: Date;
}