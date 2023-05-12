import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from '../entities/employee.entity';
import { Repository } from 'typeorm';
import { Department } from 'src/modules/departments/department.entity';
import { CreateEmployeeResponse } from '../DTOs/types';
import { CreateEmployeeRepositoryDTO } from './DTOs/create-employee.dto';

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
  }: // TODO: Create DTO to type this
  any): Promise<Employee[]> {
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

  async saveEmployee(
    newEmployeeData: CreateEmployeeRepositoryDTO,
  ): Promise<CreateEmployeeResponse> {
    const dbResponse = await this.repository.save({ ...newEmployeeData });
    const { id } = dbResponse;
    return { id: String(id) };
  }

  async findByEmail(email: string): Promise<Employee> {
    return await this.repository.findOne({ where: { email } });
  }

  async getRoles(userId: string): Promise<Employee> {
    return this.repository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });
  }
}
