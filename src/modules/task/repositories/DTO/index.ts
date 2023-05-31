import { Employee } from 'src/modules/employee/entities/employee.entity';
import { TaskPriority, TaskStatus } from '../../enums';

export type CreateTaskRepositoryDTO = {
  title: string;
  description: string;
  assignee: Employee;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: Date;
  created_by: Employee;
};

export type UpdateTaskRepositoryDTO = {
  title: string;
  description: string;
  assignee: Employee;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: Date;
};
