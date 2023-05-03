import { Injectable, NotFoundException } from '@nestjs/common';
import { DepartmentsService } from '../departments/department.service';
import { CreateEmployeeDTO } from './DTOs/CreateEmployeeDTO';
import { Employee } from './employee.entity';
import { EmployeeRepository } from './repositories/employee.repository';
import { CreateEmployeeResponse } from './DTOs/types';

@Injectable()
export class EmployeeService {
  constructor(
    private departmentService: DepartmentsService,
    private employeeRepository: EmployeeRepository,
  ) {}

  async getEmployeeByDepartment(
    departmentName: string,
    page: number,
    limit: number,
  ): Promise<Employee[]> {
    const department = await this.departmentService.getDepartamentByName(
      departmentName,
    );
    if (!department)
      throw new NotFoundException(`Department ${departmentName} not found`);

    const { id } = department;
    return await this.employeeRepository.getEmployeesByDepartment({
      page,
      limit,
      id,
    });
  }

  async createEmployee(
    data: CreateEmployeeDTO,
  ): Promise<CreateEmployeeResponse> {
    const { departmentName } = data;
    const department = await this.departmentService.getDepartamentByName(
      departmentName,
    );

    if (!department) {
      throw new NotFoundException(`Departament ${departmentName} not found`);
    }

    delete data.departmentName;

    return await this.employeeRepository.saveEmployee({ ...data, department });
  }
}
