import { Injectable } from '@nestjs/common';
import { DepartmentRepository } from '../repositories/department.repository';

@Injectable()
export class ListAllDepartmentsUseCase {
  constructor(private repositoy: DepartmentRepository) {}

  async execute() {
    return await this.repositoy.findAll();
  }
}
