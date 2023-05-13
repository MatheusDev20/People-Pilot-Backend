import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DepartmentsService } from 'src/modules/departments/services/department.service';
import { EmployeeRepository } from '../repositories/employee.repository';
import { RegisteredEmail } from 'src/errors';

@Injectable()
export class Validations {
  constructor(
    private departmentService: DepartmentsService,
    private employeeRepository: EmployeeRepository,
  ) {}

  async validateEmployeeEntry(data: { departmentName: string; email: string }) {
    const { departmentName, email } = data;
    const existedUser = await this.employeeRepository.findByEmail(email);
    if (existedUser) throw new BadRequestException(RegisteredEmail);

    const employeeDepartment = await this.departmentService.getDepartamentByName(departmentName);

    if (!employeeDepartment) {
      throw new NotFoundException(`Departament ${departmentName} not found`);
    }
  }
}
