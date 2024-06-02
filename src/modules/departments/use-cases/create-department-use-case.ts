import { EmployeeRepository } from 'src/modules/employee/repositories/employee.repository';
import { CreateDepartmentDTO } from '../DTO/create-department.dto';
import { DepartmentRepository } from '../repositories/department.repository';
import { BadRequestException } from '@nestjs/common';
import { CreateDepartmentRepositoryDTO } from '../repositories/DTO/create-department.dto';
import { Organization } from 'src/modules/organizations/entities/organizations.entity';

type Input = CreateDepartmentDTO & {
  organization: Organization;
};
export class CreateDepartmentUseCase {
  constructor(
    private employeeRepository: EmployeeRepository,
    private departmentsRepository: DepartmentRepository,
  ) {}

  async execute(data: Input): Promise<{ id: string }> {
    const { name, managerEmail } = data;
    const existedDepartment = await this.departmentsRepository.find({
      where: { name },
    });

    if (existedDepartment) {
      throw new BadRequestException(`Department ${name} already exists`);
    }

    const manager = await this.employeeRepository.find({
      where: { email: managerEmail },
    });
    // TODO: Check if the role is actually manager

    if (!manager)
      throw new BadRequestException(
        `Manager ${managerEmail} not found in the System`,
      );

    // const organization =
    //   await this.departmentsRepository.findOrganizationById();

    const newDepartment: CreateDepartmentRepositoryDTO = {
      ...data,
      manager: manager,
    };
    const { id } = await this.departmentsRepository.save(newDepartment);
    return { id };
  }
}
