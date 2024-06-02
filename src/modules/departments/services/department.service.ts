import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DepartmentRepository } from '../repositories/department.repository';
import { UpdateDepartmentDTO } from '../DTO/update-department.dto';
import { DeleteDepartmentResponseDTO } from '../DTO/responses.dto';
import { UpdateDepartmentRepositoryDTO } from '../repositories/DTO/update-deparment.dto';
import { EmployeeRepository } from 'src/modules/employee/repositories/employee.repository';

@Injectable()
export class DepartmentsService {
  constructor(
    private departmentRepository: DepartmentRepository,
    private employeeRepository: EmployeeRepository,
  ) {}

  async updateDepartment(id: string, data: Partial<UpdateDepartmentDTO>) {
    const { managerEmail, name } = data;
    if (name && (await this.departmentRepository.find({ where: { name } })))
      throw new BadRequestException(`Department ${name} already exists`);

    if (
      managerEmail &&
      !(await this.employeeRepository.find({ where: { email: managerEmail } }))
    )
      throw new BadRequestException(
        `Manager Mail ${managerEmail} not found in the System`,
      );

    delete data.managerEmail;

    const updateData: Partial<UpdateDepartmentRepositoryDTO> = { ...data };

    if (managerEmail)
      updateData.manager = await this.employeeRepository.find({
        where: { email: managerEmail },
      });

    return this.departmentRepository.updateDepartment(id, updateData);
  }

  async delete(id: string): Promise<DeleteDepartmentResponseDTO> {
    if (!this.departmentRepository.find({ where: { id } }))
      throw new NotFoundException(`Department not found `);

    return await this.departmentRepository.delete(id);
  }
}
