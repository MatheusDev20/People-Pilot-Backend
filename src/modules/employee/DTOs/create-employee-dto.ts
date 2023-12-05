import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsDateYYYYMMDD } from 'src/class-validator/dates-constraint';

export class CreateEmployeeDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(8)
  // @IsStrongPassword()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(40)
  phone: string;

  @ApiProperty({
    required: false,
    description: 'Only passed if the role is employee',
  })
  @MaxLength(30)
  @IsOptional()
  @IsString()
  departmentName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(40)
  position: string;

  @IsNotEmpty()
  @IsDateYYYYMMDD()
  hire_date: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(21)
  @IsIn(['employee', 'manager', 'admin'])
  role: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateYYYYMMDD()
  birthDate: string;
}
