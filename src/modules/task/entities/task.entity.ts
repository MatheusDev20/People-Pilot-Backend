import { Employee } from 'src/modules/employee/entities/employee.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TaskPriority, TaskStatus } from '../enums';
import { isoToLocale } from 'src/helpers';
import { Transform } from 'class-transformer';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  // Many tasks can be assignee to one employee.
  @ManyToOne(() => Employee, (employee) => employee.assignee_tasks)
  assignee: Employee;

  @ManyToOne(() => Employee, (employee) => employee.created_tasks)
  created_by: Employee;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.ON_HOLD,
  })
  status: TaskStatus;

  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.LOW,
  })
  priority: TaskPriority;

  @Transform(({ value }) => isoToLocale(value, 'en-US'))
  @CreateDateColumn()
  created_at: Date;

  @Transform(({ value }) => isoToLocale(value, 'en-US'))
  @UpdateDateColumn()
  update_at: Date;

  @Column({ type: 'date', nullable: true })
  due_date: string;

  @Column({ type: 'date', default: null })
  completion_date: string;
}
