import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Department } from '../entities/department.entity';
import { DepartmentRepository } from '../repositories/department.repository';
import { UpdateDepartmentDTO } from '../DTO/update-department.dto';
import { DeleteDepartmentResponseDTO } from '../DTO/responses.dto';
import { UpdateDepartmentRepositoryDTO } from '../repositories/DTO/update-deparment.dto';
import { ValidColumn } from 'src/@types';
import { FindOptionsWhere } from 'typeorm';
import { Employee } from 'src/modules/employee/entities/employee.entity';
import { EmployeeRepository } from 'src/modules/employee/repositories/employee.repository';
import { Organization } from 'src/modules/organizations/entities/organizations.entity';

@Injectable()
export class DepartmentsService {
  constructor(
    private departmentRepository: DepartmentRepository,
    private employeeRepository: EmployeeRepository,
    // @Inject(forwardRef(() => EmployeeService))
  ) {}

  async find(property: ValidColumn<Department>, value: string) {
    const options: FindOptionsWhere<Department> = { [property]: value };
    return await this.departmentRepository.find({ where: options });
  }

  async updateDepartment(id: string, data: Partial<UpdateDepartmentDTO>) {
    const { managerEmail, name } = data;
    if (name && (await this.find('name', name)))
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

  /**
   * When entering a manager, they will be attached to the default department "Managers".
   * If this department does not exist, create!
   */
  async createDefaultDepartment(): Promise<Department> {
    return await this.departmentRepository.save({
      description: 'Managers Department',
      name: 'Managers',
      manager: new Employee(),
      organization: new Organization(),
    });
  }
}
