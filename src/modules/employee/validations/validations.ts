import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DepartmentsService } from 'src/modules/departments/services/department.service';
import { EmployeeRepository } from '../repositories/employee.repository';
import { RegisteredEmail } from 'src/errors/messages';
import { UpdateEmployeeDTO } from '../DTOs/update-employee.dto';

@Injectable()
export class Validations {
  constructor(
    private departmentService: DepartmentsService,
    private employeeRepository: EmployeeRepository,
  ) {}

  async validateEmployeeEntry(data: Partial<UpdateEmployeeDTO>) {
    const { departmentName, email } = data;
    if (departmentName || email) {
      const existedUser = await this.employeeRepository.findByEmail(email);
      if (existedUser) throw new BadRequestException(RegisteredEmail);
      const employeeDepartment = await this.departmentService.getDepartamentByName(departmentName);

      if (!employeeDepartment) {
        throw new NotFoundException(`Departament ${departmentName} not found`);
      }
    }
  }

  async validateDepartmentOnCreation(departmentName: string) {
    if (!departmentName) throw new BadRequestException('You must specify the Department');
    const selectedDepartment = await this.departmentService.getDepartamentByName(departmentName);
    if (!selectedDepartment) {
      throw new NotFoundException(`Departament ${departmentName} not found`);
    }
    return selectedDepartment;
  }
}
