import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TaskPriority, TaskStatus } from '../enums';
import { IsDateDDMMYYYY } from 'src/class-validator/custom-validators';

export class UpdateTaskDTO {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEmail()
  assignee_mail: string;

  @IsEnum(TaskStatus, { message: 'Invalid value for status' })
  @IsOptional()
  status: TaskStatus;

  @IsEnum(TaskPriority, { message: 'Invalid value for priority' })
  @IsNotEmpty()
  priority: TaskPriority;

  @IsNotEmpty()
  @IsDateDDMMYYYY()
  due_date: string;

  @IsOptional()
  @IsDateDDMMYYYY()
  completion_date: string;
}
