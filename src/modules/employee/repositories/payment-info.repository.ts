import { InjectRepository } from '@nestjs/typeorm';
import { PaymentInfo } from '../entities/paymentInfo.entity';
import { Repository } from 'typeorm';
import { PaymentInfoDTO } from '../DTOs/payment-info-dto';
import { Injectable } from '@nestjs/common';
import { Bank } from '../entities/banks.entity';

@Injectable()
export class PaymentInfoRepository {
  constructor(
    @InjectRepository(PaymentInfo) private repository: Repository<PaymentInfo>,
    @InjectRepository(Bank) private bankRepository: Repository<Bank>,
  ) {}

  async save(data: PaymentInfoDTO): Promise<string> {
    await this.repository.save(data);
    return '3';
  }

  async getBank(bankName: string): Promise<Bank> {
    const dbResponse = await this.bankRepository.findOne({
      where: { name: bankName },
    });

    return dbResponse;
  }

  async getAllBanks(): Promise<Bank[]> {
    const dbResponse = await this.bankRepository.find();
    return dbResponse;
  }
}
