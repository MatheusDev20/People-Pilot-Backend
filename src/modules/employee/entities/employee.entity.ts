import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Department } from '../../departments/entities/department.entity';
import { Role } from './roles.entity';
import { Task } from 'src/modules/task/entities/task.entity';
import { Exclude, Transform } from 'class-transformer';
import { isoToLocale } from 'src/helpers';
import { RefreshTokens } from './refresh-token.entity';
import { PaymentInfo } from './paymentInfo.entity';
import { Documents } from './documents.entity';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  @Exclude()
  password: string;

  @Column()
  phone: string;

  @Column({ type: 'date', nullable: true })
  birthDate: string;

  @Column({ type: 'date', nullable: true })
  hire_date: string;

  @Column()
  position: string;

  @Transform(({ value }) => isoToLocale(value, 'pt-BR'))
  @UpdateDateColumn()
  updated_at: Date;

  @Transform(({ value }) => isoToLocale(value, 'pt-BR'))
  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Department, (department) => department.employees)
  department: Department;

  @ManyToOne(() => Role, (role) => role.employees)
  role: Role;

  @Column({ nullable: true })
  avatar: string;

  @OneToMany(() => Task, (task) => task.assignee)
  assignee_tasks: Task[];

  @OneToMany(() => Task, (task) => task.created_by)
  created_tasks: Task[];

  @Column()
  status: string;

  @OneToOne(() => RefreshTokens, (refreshToken) => refreshToken.userId)
  refreshToken: RefreshTokens;

  @OneToMany(() => Department, (department) => department.manager)
  managedDepartments: Department[];

  @OneToOne(() => PaymentInfo, { nullable: true })
  @JoinColumn({
    name: 'paymentInfoId',
    referencedColumnName: 'id',
  })
  paymentInfo: PaymentInfo;

  @OneToMany(() => Documents, (document) => document.employee, {
    nullable: true,
  })
  documents: Documents[];
}
