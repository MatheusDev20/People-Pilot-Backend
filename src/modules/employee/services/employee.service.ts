import { RegisteredEmail } from './../../../errors/';
import { Hashing } from '../../security/interfaces/hashing';
import { CreateEmployeeRepositoryDTO } from '../repositories/DTOs/create-employee.dto';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DepartmentsService } from '../../departments/services/department.service';
import { CreateEmployeeDTO } from '../DTOs/create-employee-dto';
import { Employee } from '../entities/employee.entity';
import { EmployeeRepository } from '../repositories/employee.repository';
import { CreateEmployeeResponse } from '../DTOs/types';
import { Role } from '../entities/roles.entity';
import { RolesRepository } from '../repositories/roles.repository';

@Injectable()
export class EmployeeService {
  constructor(
    private departmentService: DepartmentsService,
    private employeeRepository: EmployeeRepository,
    private rolesRepository: RolesRepository,
    @Inject('HashingService') private hashService: Hashing,
  ) {}

  async getEmployeeByDepartment(
    departmentName: string,
    page: number,
    limit: number,
  ): Promise<Employee[]> {
    const department = await this.departmentService.getDepartamentByName(
      departmentName,
    );
    if (!department)
      throw new NotFoundException(`Department ${departmentName} not found`);

    const { id } = department;
    return await this.employeeRepository.getEmployeesByDepartment({
      page,
      limit,
      id,
    });
  }

  async createEmployee(
    data: CreateEmployeeDTO,
  ): Promise<CreateEmployeeResponse> {
    const { departmentName, email, password, roles } = data;

    const existedUser = await this.employeeRepository.findByEmail(email);
    if (existedUser) throw new BadRequestException(RegisteredEmail);

    const employeeDepartment =
      await this.departmentService.getDepartamentByName(departmentName);

    if (!employeeDepartment) {
      throw new NotFoundException(`Departament ${departmentName} not found`);
    }
    const newEmployeeData: CreateEmployeeRepositoryDTO = {
      ...data,
      password: await this.hashService.hash(password),
      department: employeeDepartment,
      roles: await this.pushRoles(roles),
    };

    return await this.employeeRepository.saveEmployee(newEmployeeData);
  }

  async getByEmail(email: string): Promise<Employee> {
    return await this.employeeRepository.findByEmail(email);
  }

  /**
   *
   * @param roles An string of roles like admin,manager...
   */
  async pushRoles(roles: string): Promise<Role[]> {
    const userRoles: Role[] = [];
    for (const role of roles.split(',')) {
      const findRole = await this.rolesRepository.findRole(role);
      if (!findRole) {
        throw new BadRequestException('Desired role not found');
      }
      userRoles.push(findRole);
    }
    return userRoles;
  }
}
