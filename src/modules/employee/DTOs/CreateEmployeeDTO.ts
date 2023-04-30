import { IsNotEmpty, IsString, MaxLength, Validate } from 'class-validator';
import { DepartmentNameValidator } from '../validators/DepartmentNameValidator';

export class CreateEmployeeDTO {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  name: string;

  @IsNotEmpty()
  @IsString()
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
  role: string;
}
