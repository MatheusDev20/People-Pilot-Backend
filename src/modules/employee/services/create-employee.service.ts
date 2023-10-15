import { Hashing } from '../../security/interfaces/hashing';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DepartmentsService } from '../../departments/services/department.service';
import { CreateEmployeeDTO } from '../DTOs/create-employee-dto';
import { EmployeeRepository } from '../repositories/employee.repository';
import { CreateEmployeeResponse } from '../DTOs/responses.dto';
import { Utils } from '../utils/employee.utils';
import { EmployeeService } from './employee.service';
import { CreateEmployeeRepositoryDTO } from '../repositories/DTOs/employe.dto';

@Injectable()
export class CreateEmployeeService {
  constructor(
    private departmentService: DepartmentsService,
    private employeeService: EmployeeService,
    private employeeRepository: EmployeeRepository,
    private utils: Utils,
    @Inject('HashingService') private hashService: Hashing,
  ) {}

  async execute(data: CreateEmployeeDTO): Promise<CreateEmployeeResponse> {
    const { departmentName, ...newUserData } = data;
    const existedUser = await this.employeeService.find('email', newUserData.email);
    if (existedUser) throw new BadRequestException('Email Already in use');
    /**
     * If the employee is a manager, attach to a default department (Managers)
     */
    if (await this.utils.isManager(newUserData.roles)) {
      return await this.createManager(data);
    }

    /**
     * If the employee is not a manager you have to specify the department
     */

    if (!departmentName) throw new BadRequestException('You must specify the Department');
    const selectedDepartment = await this.departmentService.find('name', departmentName);
    if (!selectedDepartment) throw new NotFoundException(`Departament ${departmentName} not found`);

    const newEmployeeData: CreateEmployeeRepositoryDTO = {
      ...newUserData,
      password: await this.hashService.hash(newUserData.password),
      department: selectedDepartment,
      roles: await this.utils.pushRoles(newUserData.roles),
      status: 'Active',
    };

    return await this.employeeRepository.save(newEmployeeData);
  }

  private async createManager(
    data: Omit<CreateEmployeeDTO, 'departmentName'>,
  ): Promise<CreateEmployeeResponse> {
    const { password, roles } = data;
    // eslint-disable-next-line prefer-const
    const managersDepartment = await this.departmentService.find('name', 'Managers');
    const defaultDepartment =
      managersDepartment ?? (await this.departmentService.createDefaultDepartment());

    const newEmployeeData: CreateEmployeeRepositoryDTO = {
      ...data,
      password: await this.hashService.hash(password),
      department: defaultDepartment,
      roles: await this.utils.pushRoles(roles),
      status: 'Active',
    };

    return await this.employeeRepository.save(newEmployeeData);
  }
}
