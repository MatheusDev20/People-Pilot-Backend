import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { TaskPriority, TaskStatus } from '../enums';
import { IsDateDDMMYYYY } from 'src/class-validator/custom-validators';

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

  @IsOptional()
  createdBy: string;
}
