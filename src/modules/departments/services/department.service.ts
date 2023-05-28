import { Injectable, NotFoundException } from '@nestjs/common';
import { Department } from '../entities/department.entity';
import { CreateDepartmentDTO } from '../DTO/create-department.dto';
import { DepartmentRepository } from '../repositories/department.repository';
import { UpdateDepartmentDTO } from '../DTO/update-department.dto';
import { CreateDepartmentResponseDTO, DeleteDepartmentResponseDTO } from '../DTO/responses.dto';
import { DepartmentValidations } from '../validations/validations';
import { EmployeeRepository } from 'src/modules/employee/repositories/employee.repository';
import { CreateDepartmentRepositoryDTO } from '../repositories/DTO/create-department.dto';
import { UpdateDepartmentRepositoryDTO } from '../repositories/DTO/update-deparment.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    private departmentRepository: DepartmentRepository,
    private validations: DepartmentValidations,
    private employeeRepository: EmployeeRepository,
  ) {}

  async getDepartmentById(id: string) {
    return this.departmentRepository.findDepartment({ where: { id } });
  }

  async createDepartment(data: CreateDepartmentDTO): Promise<CreateDepartmentResponseDTO> {
    await this.validations.validateDepartmentEntry(data);
    const { managerMail } = data;
    const { name } = await this.employeeRepository.findByEmail(managerMail);
    const newDepartment: CreateDepartmentRepositoryDTO = {
      ...data,
      manager: name,
    };
    const { id } = await this.departmentRepository.saveDepartment(newDepartment);
    return { id };
  }

  async getDepartamentByName(name: string): Promise<Department> {
    return await this.departmentRepository.findByName(name);
  }

  async updateDepartment(id: string, data: Partial<UpdateDepartmentDTO>) {
    await this.validations.validateDepartmentEntry(data);
    const { managerMail } = data;

    delete data.managerMail;

    const newDepartment: Partial<UpdateDepartmentRepositoryDTO> = { ...data };

    if (managerMail)
      newDepartment.manager = (await this.employeeRepository.findByEmail(managerMail)).name;

    return this.departmentRepository.updateDepartment(id, newDepartment);
  }

  async delete(id: string): Promise<DeleteDepartmentResponseDTO> {
    if (!this.departmentRepository.findDepartment({ where: { id } }))
      throw new NotFoundException(`Department not found `);

    return await this.departmentRepository.delete(id);
  }

  /**
   * When entering a manager, they will be attached to the default department "Managers".
   * If this department does not exist, create!
   */
  async createDefaultDepartment(): Promise<Department> {
    return await this.departmentRepository.saveDepartment({
      description: 'Managers Department',
      name: 'Managers',
      manager: 'Manager',
    });
  }
}
