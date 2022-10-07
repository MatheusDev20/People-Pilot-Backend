import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './department.entity';
import { CreateDepartmentDTO } from './DTO/create-department.dto';
import { v4 } from 'uuid';
import { Roles } from '../roles/role.entity';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department) private repository: Repository<Department>,
  ) {}

  async createDepartment(data: CreateDepartmentDTO) {
    // const newDepartment = new Department();
    // newDepartment.name = data.name;
    // newDepartment.id = v4();
    // newDepartment.manager = data.manager;
    // newDepartment.isActive = false;
    // newDepartment.description = data.description;
    // const role = new Roles();
    // newDepartment.roles = [role];
    // await this.repository.save(newDepartment);
  }
}
