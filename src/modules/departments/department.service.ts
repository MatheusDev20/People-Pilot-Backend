import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../employee/employee.entity';
import { Department } from './department.entity';
import { CreateDepartmentDTO } from './DTO/create-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department) private repository: Repository<Department>,
  ) {}

  async getDepartmentById(id: string) {
    return this.repository.findOneBy({ id });
  }
  async createDepartment(data: CreateDepartmentDTO): Promise<Department> {
    return await this.repository.save(data);
  }

  async getDepartamentByName(name: string): Promise<Department> {
    return await this.repository.findOneBy({ name });
  }

  async getDepartmentEmployees(departmentName: string): Promise<Employee[]> {
    const department = await this.getDepartamentByName(departmentName);
    if (!department) throw new NotFoundException('Department not found');
    const { name } = department;

    const { employees } = await this.repository.findOne({
      where: {
        name: name,
      },
      relations: {
        employees: true,
      },
    });

    return employees;
  }
}
