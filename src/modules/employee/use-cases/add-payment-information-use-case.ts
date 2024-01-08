import { Injectable, NotFoundException } from '@nestjs/common';
import { PaymentInfoDTO } from '../DTOs/payment-info-dto';
import { EmployeeRepository } from '../repositories/employee.repository';
import { PaymentInfoRepository } from '../repositories/payment-info.repository';

type Input = {
  employeeId: string;
  paymentInfo: PaymentInfoDTO;
};

type Output = {
  id: string;
};

@Injectable()
export class AddPaymentInformation {
  constructor(
    private employeeRepository: EmployeeRepository,
    private paymentInfoRepository: PaymentInfoRepository,
  ) {}
  async execute(input: Input): Promise<Output> {
    const { employeeId, paymentInfo } = input;
    const employee = await this.employeeRepository.find({
      where: { id: employeeId },
    });

    if (!employee) throw new NotFoundException('Employee not found');
    const { bankName } = paymentInfo;
    const bank = await this.paymentInfoRepository.getBank(bankName);

    if (!bank)
      throw new NotFoundException(
        'Selected Bank not supported by People Pilot',
      );

    await this.paymentInfoRepository.save(paymentInfo);

    const updatedId = await this.employeeRepository.savePaymentInfo(
      employee,
      paymentInfo,
    );

    return { id: updatedId };
  }
}
