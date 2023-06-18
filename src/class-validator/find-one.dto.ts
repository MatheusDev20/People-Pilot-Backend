import { IsNotEmpty, IsUUID } from 'class-validator';

export class FindOneDTO {
  @IsNotEmpty()
  @IsUUID()
  uuid: string;
}
