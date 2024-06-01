import { IsNotEmpty, IsString, Max, MaxLength } from 'class-validator';

export class CreateOrganization {
  @IsNotEmpty()
  @IsString()
  @MaxLength(40)
  name: string;
}
