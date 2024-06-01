import { DepartmentsService } from 'src/modules/departments/services/department.service';
import { Utils } from '../utils/employee.utils';
import { EmployeeRepository } from '../repositories/employee.repository';
import { Hashing } from 'src/modules/security/interfaces/hashing';
import { BadRequestException, Inject } from '@nestjs/common';
import { CreateEmployeeDTO } from '../DTOs/create-employee-dto';
import { CreateEmployeeRepositoryDTO } from '../repositories/DTOs/employe.dto';

export class CreateManagerUseCase {
  constructor(
    private departmentService: DepartmentsService,
    private employeeRepository: EmployeeRepository,
    private utils: Utils,
    @Inject('HashingService') private hashService: Hashing,
  ) {}

  async execute(data: CreateEmployeeDTO) {
    const { password, role } = data;

    if (!password)
      throw new BadRequestException(
        'Password is required to register a new MANAGER or ADMIN level',
      );

    const user = await this.employeeRepository.find({
      where: { email: data.email },
    });

    if (user) throw new BadRequestException('Manager Email already in use');

    const managersDepartment = await this.departmentService.find(
      'name',
      'Managers',
    );

    const defaultDepartment =
      managersDepartment ??
      (await this.departmentService.createDefaultDepartment());

    const newEmployeeData: CreateEmployeeRepositoryDTO = {
      ...data,
      password: await this.hashService.hash(password),
      department: defaultDepartment,
      role: await this.utils.pushRoles(role),
      status: 'Active',
    };

    return await this.employeeRepository.save(newEmployeeData);
  }
}
