import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateRoleDTO {
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  name: string;
}
