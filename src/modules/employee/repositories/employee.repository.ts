import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from '../entities/employee.entity';
import { Repository } from 'typeorm';
import { Department } from 'src/modules/departments/department.entity';
import { CreateEmployeeResponse, UpdateEmployeeResponse } from '../DTOs/responses.dto';
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

  async saveEmployee(
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
    console.log(updateEmployeeData);
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

  async findByEmail(email: string): Promise<Employee> {
    return await this.repository.findOne({ where: { email } });
  }
  async findById(id: string): Promise<Employee> {
    return await this.repository.findOne({ where: { id } });
  }

  async getRoles(userId: string): Promise<Employee> {
    return this.repository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });
  }
}
