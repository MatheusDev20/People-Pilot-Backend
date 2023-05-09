import { Injectable } from '@nestjs/common';
import { Department } from '../department.entity';
import { CreateDepartmentDTO } from '../DTO/create-department.dto';
import { DepartmentRepository } from '../repositories/department.repository';

@Injectable()
export class DepartmentsService {
  constructor(private departmentRepository: DepartmentRepository) {}

  async getDepartmentById(id: string) {
    return this.departmentRepository.findDepartment({ where: { id } });
  }

  async createDepartment(data: CreateDepartmentDTO): Promise<Department> {
    return await this.departmentRepository.saveDepartment(data);
  }

  async getDepartamentByName(name: string): Promise<Department> {
    return await this.departmentRepository.findDepartment({ where: { name } });
  }
}
