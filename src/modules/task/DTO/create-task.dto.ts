import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { TaskPriority, TaskStatus } from '../enums';

export class CreateTaskDTO {
  @IsNotEmpty()
  @IsString()
  @MaxLength(65)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  description: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  assignee_email: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status: TaskStatus;

  @IsEnum(TaskPriority)
  @IsNotEmpty()
  priority: TaskPriority;

  @IsNotEmpty()
  @IsDateString()
  due_date: Date;
}
