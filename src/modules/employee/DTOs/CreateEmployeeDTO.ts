import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  Validate,
} from 'class-validator';
import { DepartmentNameValidator } from '../validators/DepartmentNameValidator';

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
  @MaxLength(12)
  phone: string;

  @MaxLength(12)
  @IsNotEmpty()
  @IsString()
  @Validate(DepartmentNameValidator)
  departmentName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  role: string;
}
