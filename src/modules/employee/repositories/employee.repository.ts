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
import {
  CreateEmployeeRepositoryDTO,
  GetAllEmployesDTO,
  GetDtoByDepartment,
  UpdateEmployeeRepositoryDTO,
} from './DTOs/employe.dto';

@Injectable()
export class EmployeeRepository {
  constructor(
    @InjectRepository(Employee) private repository: Repository<Employee>,
  ) {}

  async getAll({ limit, page }: GetAllEmployesDTO): Promise<Employee[]> {
    return await this.repository
      .createQueryBuilder('employee')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  }
  /**
   * @param {Number} page - Current page
   * @param {Number} limit - Limit of records per page
   * @param {String} id - department UUID
   *
   */
  async getEmployeesByDepartment({
    page,
    limit,
    departmentId,
  }: GetDtoByDepartment): Promise<Employee[]> {
    return await this.repository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.department', 'department.id')
      .where('employee.department = :id', { id: departmentId })
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  }

  async save(
    newEmployeeData: CreateEmployeeRepositoryDTO,
  ): Promise<CreateEmployeeResponse> {
    console.log(newEmployeeData);
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
      throw new InternalServerErrorException(
        `Error Deleting entity Employee ${id}`,
      );
    }

    return { id };
  }

  /**
   Find methods
   */

  async find(
    options: FindOneOptions<Employee>,
    pushRelations = null,
  ): Promise<Employee> {
    console.log(options);
    if (pushRelations)
      options = { ...options, ...{ relations: pushRelations } };

    return await this.repository.findOne(options);
  }

  async getRoles(userId: string): Promise<Employee> {
    return await this.repository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });
  }
}
