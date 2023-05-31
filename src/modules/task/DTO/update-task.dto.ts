import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TaskPriority, TaskStatus } from '../enums';
import { IsDateDDMMYYYY } from 'src/class-validator/custom-validators';

export class UpdateTaskDTO {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsEmail()
  assignee_email: string;

  @IsOptional()
  @IsEnum(TaskStatus, { message: 'Invalid value for status' })
  status: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority, { message: 'Invalid value for priority' })
  priority: TaskPriority;

  @IsOptional()
  @IsDateDDMMYYYY()
  due_date: string;

  @IsOptional()
  @IsDateDDMMYYYY()
  completion_date: string;
}
