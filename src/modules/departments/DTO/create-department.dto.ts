import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
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
  @IsString()
  @MaxLength(25)
  manager: string;
}
