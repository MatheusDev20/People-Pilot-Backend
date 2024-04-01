import { Injectable } from '@nestjs/common';
import { DepartmentRepository } from '../repositories/department.repository';

@Injectable()
export class ListAllDepartmentsUseCase {
  constructor(private repositoy: DepartmentRepository) {}

  async execute() {
    const response = await this.repositoy.findAll();
    const departments = response.filter((department) => department.name !== 'Managers').map((data) => ({
      ...data,
      employeeCount: data.employees.length,
    }));

    return departments
  }
}
