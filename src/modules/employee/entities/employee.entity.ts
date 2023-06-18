import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Department } from '../../departments/entities/department.entity';
import { Role } from './roles.entity';
import { Task } from 'src/modules/task/entities/task.entity';
import { Exclude, Transform } from 'class-transformer';
import { isoToLocale } from 'src/helpers';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
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

  @Transform(({ value }) => isoToLocale(value, 'en-US'))
  @UpdateDateColumn()
  updated_at: Date;

  @Transform(({ value }) => isoToLocale(value, 'en-US'))
  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Department, (department) => department.employees)
  department: Department;

  @ManyToMany(() => Role, (role) => role.employees)
  @JoinTable({
    name: 'employee_roles', // Specify the table name
    joinColumn: { name: 'employee_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  @Column({ nullable: true })
  avatar: string;

  @OneToMany(() => Task, (task) => task.assignee)
  assignee_tasks: Task[];

  @OneToMany(() => Task, (task) => task.created_by)
  created_tasks: Task[];
}
