import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './department.entity';
import { CreateDepartmentDTO } from './DTO/create-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department) private repository: Repository<Department>,
  ) {}

  async createDepartment(data: CreateDepartmentDTO): Promise<Department> {
    return this.repository.save(data);
  }
}
