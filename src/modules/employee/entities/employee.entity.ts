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

@Entity()
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  @Column()
  position: string;

  @UpdateDateColumn()
  updated_at: Date;

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
  hire_date: Date;

  @Column({ nullable: true })
  avatar: string;

  @OneToMany(() => Task, (task) => task.assignee)
  assignee_tasks: Task[];

  @OneToMany(() => Task, (task) => task.created_by)
  created_tasks: Task[];
}
