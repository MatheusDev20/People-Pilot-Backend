import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DepartmentsService } from '../../departments/services/department.service';
import { Employee } from '../entities/employee.entity';
import { EmployeeRepository } from '../repositories/employee.repository';
import {
  DeleteEmployeeResponse,
  UpdateEmployeeResponse,
} from '../DTOs/responses.dto';
import { UpdateEmployeeDTO } from '../DTOs/update-employee.dto';
import { FindOptionsWhere } from 'typeorm';
import { ValidColumn } from 'src/@types';
import { RefreshTokenRepository } from '../repositories/refresh-token.repository';
import { UpdateEmployeeRepositoryDTO } from '../repositories/DTOs/employe.dto';
import { RefreshTokens } from '../entities/refresh-token.entity';

@Injectable()
export class EmployeeService {
  constructor(
    private departmentService: DepartmentsService,
    private employeeRepository: EmployeeRepository,
    private refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async find(property: ValidColumn<Employee>, value: string) {
    const options: FindOptionsWhere<Employee> = { [property]: value };
    return await this.employeeRepository.find({ where: options });
  }

  async getEmployeeByDepartment(
    departmentName: string,
    page: number,
    limit: number,
  ): Promise<Employee[]> {
    const department = await this.departmentService.find(
      'name',
      departmentName,
    );
    if (!department)
      throw new NotFoundException(`Department ${departmentName} not found`);

    const { id } = department;
    return await this.employeeRepository.getEmployeesByDepartment({
      page,
      limit,
      departmentId: id,
    });
  }

  // Caso de Uso
  async update(
    id: string,
    data: Partial<UpdateEmployeeDTO>,
  ): Promise<UpdateEmployeeResponse> {
    if (!(await this.find('id', id)))
      throw new NotFoundException(`Employee ${id} not found`);
    const updatedData = await this.checkPropertiyes(data);

    return await this.employeeRepository.updateEmployee(id, updatedData);
  }

  async delete(id: string): Promise<DeleteEmployeeResponse> {
    if (!(await this.find('id', id)))
      throw new NotFoundException('Employee not found');
    return await this.employeeRepository.delete(id);
  }

  async getDetails(id: string): Promise<Employee> {
    return await this.employeeRepository.find(
      { where: { id } },
      { assignee_tasks: true, created_tasks: true, department: true },
    );
  }

  /**
   *
   * @param propertyes
   * @returns An object mutated to update only the required values of specifc keys
   */
  private checkPropertiyes = async (
    propertyes: Partial<UpdateEmployeeDTO>,
  ): Promise<Partial<UpdateEmployeeRepositoryDTO>> => {
    const entries = await Promise.all(
      Object.entries(propertyes).map(async ([key, value]) => {
        switch (key as keyof UpdateEmployeeDTO) {
          case 'email':
            const existedEmail = await this.find('email', value);
            if (existedEmail)
              throw new BadRequestException('Email already registered');
            return ['email', value];

          case 'departmentName':
            const department = await this.departmentService.find('name', value);
            if (!department)
              throw new NotFoundException('Department not found');
            return ['department', department];

          default:
            return [key, value];
        }
      }),
    );
    return Object.fromEntries(entries);
  };

  /** Store Refresh token on the Database */
  async storeRefreshToken(user: Employee, token: string): Promise<void> {
    const { refreshToken } = await this.employeeRepository.find(
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

  async getRefreshToken(token: string): Promise<RefreshTokens | null> {
    const refreshToken = await this.refreshTokenRepository.find({
      where: { token },
      relations: { userId: true },
    });
    return refreshToken;
  }
}
