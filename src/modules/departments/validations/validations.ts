import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateDepartmentDTO } from '../DTO/update-department.dto';
import { DepartmentRepository } from '../repositories/department.repository';
import { EmployeeRepository } from 'src/modules/employee/repositories/employee.repository';

@Injectable()
export class DepartmentValidations {
  constructor(
    private departmentService: DepartmentRepository,
    private employeeRepository: EmployeeRepository,
  ) {}

  async validateDepartmentEntry(data: Partial<UpdateDepartmentDTO>) {
    const { name, managerMail } = data;
    if (name && (await this.departmentService.findDepartment({ where: { name: name } }))) {
      throw new BadRequestException(`Department ${name} already exists`);
    }
    if (managerMail && !(await this.employeeRepository.findByEmail(managerMail))) {
      throw new BadRequestException(`Manager Mail ${managerMail} not found in the System`);
    }
  }
}
