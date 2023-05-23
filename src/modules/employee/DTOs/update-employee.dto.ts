import { IsDateString, IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateEmployeeDTO {
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

  @MaxLength(30)
  @IsNotEmpty()
  @IsString()
  departmentName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  position: string;

  @IsNotEmpty()
  @IsDateString()
  hire_date: string;

  @IsNotEmpty()
  @IsString()
  avatar: string;
}
