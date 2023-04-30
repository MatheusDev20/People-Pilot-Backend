import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
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

  async list(name: string) {
    return await this.departmentService.getDepartmentEmployees(name);
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
    const newEmployee = {
      ...data,
      department: department,
    };
    const res = await this.repository.save(newEmployee);
    return res;
  }
}
