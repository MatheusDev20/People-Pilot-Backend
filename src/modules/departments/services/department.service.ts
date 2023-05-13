import { BadRequestException, Injectable } from '@nestjs/common';
import { Department } from '../department.entity';
import { CreateDepartmentDTO } from '../DTO/create-department.dto';
import { DepartmentRepository } from '../repositories/department.repository';
import { UpdateDepartmentDTO } from '../DTO/update-department.dto';
import { CreateDepartmentResponseDTO, DeleteDepartmentResponseDTO } from '../DTO/responses.dto';
import { DepartmentValidations } from '../validations/validations';

@Injectable()
export class DepartmentsService {
  constructor(
    private departmentRepository: DepartmentRepository,
    private validations: DepartmentValidations,
  ) {}

  async getDepartmentById(id: string) {
    return this.departmentRepository.findDepartment({ where: { id } });
  }

  async createDepartment(data: CreateDepartmentDTO): Promise<CreateDepartmentResponseDTO> {
    const { name } = data;
    const findDepartment = await this.getDepartamentByName(name);

    if (findDepartment) throw new BadRequestException('Department already exists');

    const { id } = await this.departmentRepository.saveDepartment(data);
    return { id };
  }

  async getDepartamentByName(name: string): Promise<Department> {
    return await this.departmentRepository.findDepartment({ where: { name } });
  }

  async updateDepartment(id: string, data: Partial<UpdateDepartmentDTO>) {
    await this.validations.validateDepartmentEntry(data);
    return this.departmentRepository.updateDepartment(id, data);
  }

  async delete(id: string): Promise<DeleteDepartmentResponseDTO> {
    return await this.departmentRepository.delete(id);
  }
}
