import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEmployeeDTO } from './DTOs/CreateEmployeeDTO';
import { Employee } from './employee.entity';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee) private repository: Repository<Employee>,
  ) {}
  list() {
    return 'A list of employee has been returned';
  }

  async createEmployee(data: CreateEmployeeDTO): Promise<void> {
    // this.repository.save();
  }
}
