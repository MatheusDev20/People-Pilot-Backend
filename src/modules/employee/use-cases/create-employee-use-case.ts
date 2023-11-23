import { DepartmentsService } from 'src/modules/departments/services/department.service';
import { EmployeeService } from '../services/employee.service';
import { EmployeeRepository } from '../repositories/employee.repository';
import { Utils } from '../utils/employee.utils';
import { Hashing } from 'src/modules/security/interfaces/hashing';
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDTO } from '../DTOs/create-employee-dto';
import { CreateEmployeeRepositoryDTO } from '../repositories/DTOs/employe.dto';

type Output = {
  id: string;
};
export class CreateEmployeeUseCase {
  constructor(
    private departmentService: DepartmentsService,
    private employeeService: EmployeeService,
    private employeeRepository: EmployeeRepository,
    private utils: Utils,
    @Inject('HashingService') private hashService: Hashing,
  ) {}

  async execute(data: CreateEmployeeDTO): Promise<Output> {
    const { departmentName, ...newUserData } = data;
    const existedUser = await this.employeeService.find(
      'email',
      newUserData.email,
    );
    if (existedUser) throw new BadRequestException('Email already in use');
    if (!departmentName)
      throw new BadRequestException(
        'You must specify the Department to the new Employee',
      );
    const selectedDepartment = await this.departmentService.find(
      'name',
      departmentName,
    );

    if (!selectedDepartment)
      throw new NotFoundException(`Departament ${departmentName} not found`);
    console.log(newUserData);
    const newEmployeeData: CreateEmployeeRepositoryDTO = {
      ...newUserData,
      department: selectedDepartment,
      role: await this.utils.pushRoles('employee'),
      status: 'Active',
    };

    return await this.employeeRepository.save(newEmployeeData);
  }
}
