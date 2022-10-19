import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

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

  @IsNotEmpty()
  @IsString()
  department_name: string;

  @IsNotEmpty()
  @IsString()
  role: string;
}
