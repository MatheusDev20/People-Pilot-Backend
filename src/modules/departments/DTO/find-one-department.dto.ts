import { IsNotEmpty, IsUUID } from 'class-validator';

export class FindOneDepartmentDTO {
  @IsNotEmpty()
  @IsUUID()
  uuid: string;
}
