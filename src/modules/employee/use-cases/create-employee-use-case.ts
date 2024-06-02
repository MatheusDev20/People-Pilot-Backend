import { EmployeeRepository } from '../repositories/employee.repository';
import { Utils } from '../utils/employee.utils';
import { Hashing } from 'src/modules/security/interfaces/hashing';
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDTO } from '../DTOs/create-employee-dto';
import { CreateEmployeeRepositoryDTO } from '../repositories/DTOs/employe.dto';
import { Organization } from 'src/modules/organizations/entities/organizations.entity';
import { DepartmentRepository } from 'src/modules/departments/repositories/department.repository';

type Output = {
  id: string;
};

type Input = CreateEmployeeDTO & { organization: Organization };
export class CreateEmployeeUseCase {
  constructor(
    private employeeRepository: EmployeeRepository,
    private departmentsRepository: DepartmentRepository,
    private utils: Utils,
    @Inject('HashingService') private hashService: Hashing,
  ) {}

  async execute(data: Input): Promise<Output> {
    const { departmentName, ...newUserData } = data;
    const existedUser = await this.employeeRepository.find({
      where: { email: newUserData.email },
    });

    if (existedUser) throw new BadRequestException('Email already in use');

    if (!departmentName)
      throw new BadRequestException(
        'You must specify the Department to the new Employee',
      );

    const selectedDepartment = await this.departmentsRepository.find({
      where: { name: departmentName },
    });

    if (!selectedDepartment)
      throw new NotFoundException(`Departament ${departmentName} not found`);

    const newEmployeeData: CreateEmployeeRepositoryDTO = {
      ...newUserData,
      department: selectedDepartment,
      role: await this.utils.pushRoles('employee'),
      status: 'Active',
    };

    return await this.employeeRepository.save(newEmployeeData);
  }
}
