import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { TaskPriority, TaskStatus } from '../enums';
import { IsDateYYYYMMDD } from 'src/class-validator/dates-validators';

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
  @IsDateYYYYMMDD()
  due_date: string;

  @IsOptional()
  @IsDateYYYYMMDD()
  completion_date: string;
}
