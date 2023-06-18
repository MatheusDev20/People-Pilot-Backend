import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from '../entities/employee.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { Department } from 'src/modules/departments/entities/department.entity';
import {
  CreateEmployeeResponse,
  DeleteEmployeeResponse,
  UpdateEmployeeResponse,
} from '../DTOs/responses.dto';
import { CreateEmployeeRepositoryDTO } from './DTOs/create-employee.dto';
import { GetDtoByDepartment } from './DTOs/get-employee-by-department.dto';
import { UpdateEmployeeRepositoryDTO } from './DTOs/update-employee.dto';

@Injectable()
export class EmployeeRepository {
  constructor(@InjectRepository(Employee) private repository: Repository<Employee>) {}
  /**
   * @param {Number} page - Current page
   * @param {Number} limit - Limit of records per page
   * @param {String} id - department UUID
   *
   */
  async getEmployeesByDepartment({ page, limit, id }: GetDtoByDepartment): Promise<Employee[]> {
    return await this.repository
      .createQueryBuilder('employee')
      .leftJoin(Department, 'department', 'employee.departmentId = department.id')
      .where('department.id = departmentId', { id })
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  }

  async save(newEmployeeData: CreateEmployeeRepositoryDTO): Promise<CreateEmployeeResponse> {
    const dbResponse = await this.repository.save({ ...newEmployeeData });
    const { id } = dbResponse;
    return { id: String(id) };
  }

  async updateEmployee(
    id: string,
    updateEmployeeData: Partial<UpdateEmployeeRepositoryDTO>,
  ): Promise<UpdateEmployeeResponse> {
    try {
      await this.repository
        .createQueryBuilder('employee')
        .update(Employee)
        .set({ ...updateEmployeeData })
        .where('id = :id', { id })
        .execute();

      return { id };
    } catch (err: any) {
      console.log(err);
      throw new InternalServerErrorException(`Error updating user ${err}`);
    }
  }
  async delete(id: string): Promise<DeleteEmployeeResponse> {
    try {
      await this.repository
        .createQueryBuilder('employee')
        .delete()
        .from(Employee)
        .where('id = :id', { id })
        .execute();
    } catch (err: any) {
      throw new InternalServerErrorException(`Error Deleting entity Employee ${id}`);
    }

    return { id };
  }

  /**
   Find methods
   */

  async find(options: FindOneOptions<Employee>, pushRelations = ''): Promise<Employee> {
    if (pushRelations)
      options = { ...options, ...{ relations: { assignee_tasks: true, created_tasks: true } } };

    return await this.repository.findOne(options);
  }

  async getRoles(userId: string): Promise<Employee> {
    return await this.repository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });
  }
}
