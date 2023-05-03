import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DepartmentsService } from '../departments/department.service';
import { CreateEmployeeDTO } from './DTOs/CreateEmployeeDTO';
import { Employee } from './employee.entity';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee) private repository: Repository<Employee>,
    private departmentService: DepartmentsService,
  ) {}

  async listEmployeeByDepartment(departmentName: string) {
    return await this.departmentService.getDepartmentEmployees(departmentName);
  }

  async createEmployee(data: CreateEmployeeDTO): Promise<Employee> {
    const { departmentName } = data;
    const department = await this.departmentService.getDepartamentByName(
      departmentName,
    );

    if (!department) {
      throw new NotFoundException(`Departament ${departmentName} not found`);
    }

    delete data.departmentName;

    return await this.repository.save({ ...data, department });
  }
}
