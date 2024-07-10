import { Injectable } from '@nestjs/common';
import { EmployeeRepository } from '../repositories/employee.repository';

@Injectable()
export class DeleteEmployeeUseCase {
  constructor(private employeeRepository: EmployeeRepository) {}

  async execute(id: string): Promise<{ id: string }> {
    const employee = await this.employeeRepository.find({ where: { id } });
    if (!employee) throw new Error('Employee not found');

    await this.employeeRepository.delete(id);

    return { id };
  }
}
