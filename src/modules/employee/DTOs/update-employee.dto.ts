import { IsDateString, IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateEmployeeDTO {
  @IsString()
  @MaxLength(30)
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(12)
  phone: string;

  @MaxLength(30)
  @IsString()
  departmentName: string;

  @IsString()
  @MaxLength(25)
  position: string;

  @IsDateString()
  hire_date: string;

  @IsString()
  avatar: string;
}
