import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from '../entities/employee.entity';
import { FindOneOptions, Repository } from 'typeorm';
import {
  CreateEmployeeResponse,
  DeleteEmployeeResponse,
  UpdateEmployeeResponse,
} from '../DTOs/responses.dto';
import {
  CreateEmployeeRepositoryDTO,
  GetAllEmployesDTO,
  GetDtoByDepartment,
  ListFilterOptions,
  UpdateEmployeeRepositoryDTO,
} from './DTOs/employe.dto';
import { PaymentInfoDTO } from '../DTOs/payment-info-dto';
import { RefreshTokens } from '../entities/refresh-token.entity';

@Injectable()
export class EmployeeRepository {
  constructor(
    @InjectRepository(Employee) private repository: Repository<Employee>,
    @InjectRepository(RefreshTokens)
    private refreshTokenRepository: Repository<RefreshTokens>,
  ) {}

  async list(filters: Partial<ListFilterOptions>): Promise<Employee[]> {
    const builder = this.repository
      .createQueryBuilder('employee')
      .innerJoinAndSelect('employee.department', 'department')
      .innerJoinAndSelect('employee.role', 'role')
      .select(['employee', 'department.name', 'role.name']);

    if (filters.department) {
      builder.andWhere('department.id = :department', {
        department: filters.department,
      });
    }

    if (filters.role) {
      builder.andWhere('role.id = :roleId', { roleId: filters.role });
    }

    builder.skip((filters.page - 1) * filters.limit).take(filters.limit);

    const list = await builder.getMany();
    return list;
  }

  async getAll({ limit, page }: GetAllEmployesDTO): Promise<Employee[]> {
    return await this.repository
      .createQueryBuilder('employee')
      .skip((page - 1) * limit)
      .take(limit)
      .leftJoinAndSelect('employee.department', 'department')
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

  /* Find all managers method */
  async getAllByRole({ roleId }): Promise<Employee[]> {
    return await this.repository.find({
      where: { role: { id: roleId } },
    });
  }

  async savePaymentInfo(
    employee: Employee,
    data: PaymentInfoDTO,
  ): Promise<string> {
    await this.repository.save({
      ...employee,
      paymentInfo: data,
    });
    return employee.id;
  }

  async storeRefreshToken(user: Employee, token: string): Promise<void> {
    const { refreshToken } = await this.find(
      { where: { id: user.id } },
      { refreshToken: true },
    );

    if (refreshToken) {
      await this.refreshTokenRepository.save({ ...refreshToken, token });
      return;
    }

    await this.refreshTokenRepository.save({
      expiration: '7d',
      token,
      userId: user,
    });
  }
}
