import { DepartmentRepository } from 'src/modules/departments/repositories/department.repository';
import { GetEmployeeListDTO } from '../DTOs/get-employees-by-department';
import { Employee } from '../entities/employee.entity';
import { EmployeeRepository } from '../repositories/employee.repository';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class GetEmployeeListUseCase {
  constructor(
    private employeeRepository: EmployeeRepository,
    private departmentRepository: DepartmentRepository,
  ) {}

  async execute(data: GetEmployeeListDTO): Promise<Employee[]> {
    const { departmentName, page, limit } = data;

    if (!departmentName)
      return await this.employeeRepository.getAll({ page, limit });

    const department = await this.departmentRepository.find({
      where: { name: departmentName },
    });
    if (!department)
      throw new NotFoundException(`Department ${departmentName} not found`);

    return await this.employeeRepository.getEmployeesByDepartment({
      departmentId: department.id,
      limit,
      page,
    });
  }
}
// Compare this snippet from src/modules/employee/DTOs/get-employees-by-department.ts:
