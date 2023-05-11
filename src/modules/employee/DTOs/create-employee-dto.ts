import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserType } from '../enums/user_type';

export class CreateEmployeeDTO {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  // @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(12)
  phone: string;

  @MaxLength(30)
  @IsNotEmpty()
  @IsString()
  departmentName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  role: string;

  @IsOptional()
  userType: UserType;

  @IsNotEmpty()
  @IsDateString()
  hire_date: string;
}
