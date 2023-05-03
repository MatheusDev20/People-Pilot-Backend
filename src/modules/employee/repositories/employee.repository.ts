import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from '../employee.entity';
import { Repository } from 'typeorm';
import { Department } from 'src/modules/departments/department.entity';
import { CreateEmployeeResponse } from '../DTOs/types';

@Injectable()
export class EmployeeRepository {
  constructor(
    @InjectRepository(Employee) private repository: Repository<Employee>,
  ) {}
  /**
   * @param {Number} page - Current page
   * @param {Number} limit - Limit of records per page
   * @param {String} id - department UUID
   *
   */
  async getEmployeesByDepartment({
    page,
    limit,
    id,
  }: any): Promise<Employee[]> {
    return await this.repository
      .createQueryBuilder('employee')
      .leftJoin(
        Department,
        'department',
        'employee.departmentId = department.id',
      )
      .where('department.id = departmentId', { id })
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  }

  async saveEmployee(newEmployeeData): Promise<CreateEmployeeResponse> {
    const dbResponse = await this.repository.save(newEmployeeData);
    const { id } = dbResponse;
    return {
      id,
    };
  }
}
