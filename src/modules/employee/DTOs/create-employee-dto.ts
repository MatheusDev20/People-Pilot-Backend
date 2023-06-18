import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { IsDateYYYYMMDD } from 'src/class-validator/dates-validators';

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
  @IsOptional()
  @IsString()
  departmentName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  position: string;

  @IsNotEmpty()
  @IsDateYYYYMMDD()
  hire_date: string;

  @IsNotEmpty()
  @MaxLength(21)
  roles: string;

  @IsNotEmpty()
  @IsDateYYYYMMDD()
  birthDate: string;
}
