import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class GetEmployeeByDepartmentDTO {
  @IsNotEmpty()
  @IsString()
  @MaxLength(12)
  name: string;

  @IsOptional()
  page: number;

  @IsOptional()
  limit: number;
}
