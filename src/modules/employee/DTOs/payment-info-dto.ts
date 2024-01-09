import { IsIn, IsString, MaxLength } from 'class-validator';

export class PaymentInfoDTO {
  @IsString()
  bankName: string;

  @IsString()
  @IsIn(['CORRENTE', 'POUPANCA'])
  accountType: 'CORRENTE' | 'POUPANCA';

  @IsString()
  @MaxLength(12)
  accountNumber: string;

  @IsString()
  @MaxLength(5)
  agencyNumber: string;

  @IsString()
  pixKey: string;
}
