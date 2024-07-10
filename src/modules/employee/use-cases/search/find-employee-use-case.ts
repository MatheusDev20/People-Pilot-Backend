import { ValidColumn } from 'src/@types';
import { Employee } from '../../entities/employee.entity';
import { EmployeeRepository } from '../../repositories/employee.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FindByPropertyEmployeeUseCase {
  private readonly relations: string[] = [
    'assignee_tasks',
    'created_tasks',
    'department',
    'department.manager',
    'department.employees',
    'managedDepartments',
    'paymentInfo',
    'documents',
  ];

  constructor(private readonly employeesRepository: EmployeeRepository) {}

  async execute(
    property: ValidColumn<Employee>,
    value: string,
    options: { bringDetails: boolean },
  ): Promise<Employee> {
    const { bringDetails } = options;

    const findOptions = {
      where: { [property]: value },
      ...(bringDetails && { relations: this.relations }),
    };

    const employee = await this.employeesRepository.find(findOptions);

    if (!employee) {
      throw new Error('Employee not found');
    }

    return employee;
  }
}
