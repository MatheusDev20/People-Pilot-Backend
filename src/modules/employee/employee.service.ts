import { Hashing } from './../security/interfaces/hashing';
import { CreateEmployeeRepositoryDTO } from './repositories/DTOs/create-employee.dto';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DepartmentsService } from '../departments/department.service';
import { CreateEmployeeDTO } from './DTOs/create-employee-dto';
import { Employee } from './employee.entity';
import { EmployeeRepository } from './repositories/employee.repository';
import { CreateEmployeeResponse } from './DTOs/types';

@Injectable()
export class EmployeeService {
  constructor(
    private departmentService: DepartmentsService,
    private employeeRepository: EmployeeRepository,
    @Inject('HashingService') private hashService: Hashing,
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

    const employeeDepartment =
      await this.departmentService.getDepartamentByName(departmentName);

    if (!employeeDepartment) {
      throw new NotFoundException(`Departament ${departmentName} not found`);
    }

    const newEmployeeData: CreateEmployeeRepositoryDTO = {
      ...data,
      password: await this.hashService.hash(data.password),
      department: employeeDepartment,
    };

    return await this.employeeRepository.saveEmployee(newEmployeeData);
  }
}
