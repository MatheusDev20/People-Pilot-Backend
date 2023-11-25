import { IsOptional, IsString, MaxLength } from 'class-validator';

export class GetEmployeeListDTO {
  @IsOptional()
  @IsString()
  @MaxLength(12)
  departmentName: string;

  @IsOptional()
  page: number;

  @IsOptional()
  limit: number;
}
