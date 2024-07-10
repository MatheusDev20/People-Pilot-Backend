import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EmployeeRepository } from '../repositories/employee.repository';
import { UpdateEmployeeDTO } from '../DTOs';
import { UpdateEmployeeRepositoryDTO } from '../repositories/DTOs/employe.dto';
import { DepartmentRepository } from 'src/modules/departments/repositories/department.repository';

@Injectable()
export class UpdateEmployeeUseCase {
  constructor(
    private employeeRepository: EmployeeRepository,
    private departmentsRepository: DepartmentRepository,
  ) {}

  async execute(
    id: string,
    data: Partial<UpdateEmployeeDTO>,
  ): Promise<{ id: string }> {
    const employee = await this.employeeRepository.find({ where: { id } });
    if (!employee) throw new Error('Employee not found');

    const updatedData = await this.checkPropertiyes(data);
    await this.employeeRepository.updateEmployee(id, updatedData);

    return { id };
  }

  private checkPropertiyes = async (
    propertyes: Partial<UpdateEmployeeDTO>,
  ): Promise<Partial<UpdateEmployeeRepositoryDTO>> => {
    const entries = await Promise.all(
      Object.entries(propertyes).map(async ([key, value]) => {
        switch (key as keyof UpdateEmployeeDTO) {
          case 'email':
            const existedEmail = await this.employeeRepository.find({
              where: { email: value },
            });
            if (existedEmail)
              throw new BadRequestException('Email already registered');
            return ['email', value];

          case 'departmentName':
            const department = await this.departmentsRepository.find({
              where: { name: value },
            });

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
}
