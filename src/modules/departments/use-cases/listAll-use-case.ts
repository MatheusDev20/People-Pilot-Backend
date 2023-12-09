import { Injectable } from '@nestjs/common';
import { DepartmentRepository } from '../repositories/department.repository';

@Injectable()
export class ListAllDepartmentsUseCase {
  constructor(private repositoy: DepartmentRepository) {}

  async execute() {
    const departments = await this.repositoy.findAll();
    return departments.filter((department) => department.name !== 'Managers');
  }
}
