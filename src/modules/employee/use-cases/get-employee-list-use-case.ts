import { DepartmentRepository } from 'src/modules/departments/repositories/department.repository';
import { GetEmployeeListDTO } from '../DTOs/get-employees-by-department';
import { Employee } from '../entities/employee.entity';
import { EmployeeRepository } from '../repositories/employee.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Utils } from '../utils/employee.utils';

@Injectable()
export class GetEmployeeListUseCase {
  constructor(
    private employeeRepository: EmployeeRepository,
    private departmentRepository: DepartmentRepository,
    private utils: Utils,
  ) {}

  async execute(data: GetEmployeeListDTO): Promise<Employee[]> {
    const { departmentName, page, limit, role } = data;
    return  await this.employeeRepository.list({
      department: departmentName ? (await this.departmentRepository.find({ where: { name: departmentName }})).id : null,
      role: role ? this.utils.getIdRoleByName(role) : null,
      page,
      limit,
    });
  }
}
// Compare this snippet from src/modules/employee/DTOs/get-employees-by-department.ts:
