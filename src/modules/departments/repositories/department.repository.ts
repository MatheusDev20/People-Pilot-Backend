import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Department } from '../department.entity';
import { CreateDepartmentDTO } from '../DTO/create-department.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DepartmentRepository {
  constructor(@InjectRepository(Department) private repository: Repository<Department>) {}

  async saveDepartment(newDepartmentData: CreateDepartmentDTO) {
    return this.repository.save(newDepartmentData);
  }

  async findDepartment(property: FindOneOptions<Department>): Promise<Department> {
    return this.repository.findOne(property);
  }
}
