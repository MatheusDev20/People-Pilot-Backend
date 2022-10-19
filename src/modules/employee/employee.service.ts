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
  list() {
    return 'A list of employee has been returned';
  }

  async createEmployee(data: CreateEmployeeDTO): Promise<Employee> {
    try {
      const employeeDepartment =
        await this.departmentService.getDepartamentByName(data.department_name);

      const newEmployee = {
        ...data,
        department_id: employeeDepartment.id,
      };
      return await this.repository.save(newEmployee);
    } catch (err) {
      console.log('Error Saving Entity =>', err);
    }
  }
}
