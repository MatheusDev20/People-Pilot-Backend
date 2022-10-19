import { Injectable } from '@nestjs/common';
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
    try {
      const employeeDepartment =
        await this.departmentService.getDepartamentByName(data.department_name);

      const newEmployee = {
        ...data,
        department: employeeDepartment,
      };

      const res = await this.repository.save(newEmployee);
      console.log('??');
      return res;
    } catch (err) {
      console.log('Error Saving Entity =>', err);
    }
  }
}
