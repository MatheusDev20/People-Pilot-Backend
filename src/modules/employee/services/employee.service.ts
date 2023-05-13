import { RegisteredEmail } from './../../../errors/';
import { Hashing } from '../../security/interfaces/hashing';
import { CreateEmployeeRepositoryDTO } from '../repositories/DTOs/create-employee.dto';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DepartmentsService } from '../../departments/services/department.service';
import { CreateEmployeeDTO } from '../DTOs/create-employee-dto';
import { Employee } from '../entities/employee.entity';
import { EmployeeRepository } from '../repositories/employee.repository';
import { CreateEmployeeResponse, UpdateEmployeeResponse } from '../DTOs/types';
import { Utils } from '../utils/employee.utils';
import { UpdateEmployeeDTO } from '../DTOs/update-employee.dto';
import { Validations } from '../validations/validations';
import { UpdateEmployeeRepositoryDTO } from '../repositories/DTOs/update-employee.dto';

@Injectable()
export class EmployeeService {
  constructor(
    private departmentService: DepartmentsService,
    private employeeRepository: EmployeeRepository,
    private utils: Utils,
    private validations: Validations,
    @Inject('HashingService') private hashService: Hashing,
  ) {}

  async getByEmail(email: string): Promise<Employee> {
    return await this.employeeRepository.findByEmail(email);
  }

  async getEmployeeByDepartment(
    departmentName: string,
    page: number,
    limit: number,
  ): Promise<Employee[]> {
    const department = await this.departmentService.getDepartamentByName(departmentName);
    if (!department) throw new NotFoundException(`Department ${departmentName} not found`);

    const { id } = department;
    return await this.employeeRepository.getEmployeesByDepartment({
      page,
      limit,
      id,
    });
  }

  async createEmployee(data: CreateEmployeeDTO): Promise<CreateEmployeeResponse> {
    const { departmentName, password, roles } = data;
    await this.validations.validateEmployeeEntry(data);

    const employeeDepartment = await this.departmentService.getDepartamentByName(departmentName);
    delete data.departmentName;

    const newEmployeeData: CreateEmployeeRepositoryDTO = {
      ...data,
      password: await this.hashService.hash(password),
      department: employeeDepartment,
      roles: await this.utils.pushRoles(roles),
    };

    return await this.employeeRepository.saveEmployee(newEmployeeData);
  }

  async updateEmployee(
    id: string,
    data: Partial<UpdateEmployeeDTO>,
  ): Promise<UpdateEmployeeResponse> {
    if (!this.employeeRepository.findById(id)) throw new NotFoundException(`User ${id} not found`);

    await this.validations.validateEmployeeEntry(data);

    const { departmentName } = data;
    delete data.departmentName;

    const newEmployeeData: Partial<UpdateEmployeeRepositoryDTO> = {
      ...data,
    };
    if (departmentName) {
      newEmployeeData.department = await this.departmentService.getDepartamentByName(
        departmentName,
      );
    }

    return this.employeeRepository.updateEmployee(id, newEmployeeData);
  }
}
