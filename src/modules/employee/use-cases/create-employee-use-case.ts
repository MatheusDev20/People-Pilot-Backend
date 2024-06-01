import { DepartmentsService } from 'src/modules/departments/services/department.service';
import { EmployeeRepository } from '../repositories/employee.repository';
import { Utils } from '../utils/employee.utils';
import { Hashing } from 'src/modules/security/interfaces/hashing';
import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDTO } from '../DTOs/create-employee-dto';
import { CreateEmployeeRepositoryDTO } from '../repositories/DTOs/employe.dto';
import { OrganizationsRepository } from 'src/modules/organizations/repositories';

type Output = {
  id: string;
};

type Input = CreateEmployeeDTO & { organizationId: string };
export class CreateEmployeeUseCase {
  constructor(
    private departmentService: DepartmentsService,
    private employeeRepository: EmployeeRepository,
    private organizationRepository: OrganizationsRepository,
    private utils: Utils,
    @Inject('HashingService') private hashService: Hashing,
  ) {}

  async execute(data: Input): Promise<Output> {
    const { departmentName, organizationId, ...newUserData } = data;
    const existedUser = await this.employeeRepository.find({
      where: { email: newUserData.email },
    });

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

    const newEmployeeData: CreateEmployeeRepositoryDTO = {
      ...newUserData,
      department: selectedDepartment,
      role: await this.utils.pushRoles('employee'),
      status: 'Active',
      organization: await this.organizationRepository.findById(organizationId),
    };

    return await this.employeeRepository.save(newEmployeeData);
  }
}
