import { IsNotEmpty, IsString, MaxLength, IsEmail } from 'class-validator';
export class CreateDepartmentDTO {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  description: string;

  @IsNotEmpty()
  @IsEmail()
  managerEmail: string;
}
