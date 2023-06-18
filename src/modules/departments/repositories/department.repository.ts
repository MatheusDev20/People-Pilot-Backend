import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Department } from '../entities/department.entity';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DeleteDepartmentResponseDTO } from '../DTO/responses.dto';
import { CreateDepartmentRepositoryDTO } from './DTO/create-department.dto';

@Injectable()
export class DepartmentRepository {
  constructor(@InjectRepository(Department) private repository: Repository<Department>) {}

  async save(newDepartmentData: CreateDepartmentRepositoryDTO) {
    return await this.repository.save(newDepartmentData);
  }

  async find(property: FindOneOptions<Department>): Promise<Department> {
    return await this.repository.findOne(property);
  }

  async updateDepartment(id: string, data: Partial<CreateDepartmentRepositoryDTO>) {
    try {
      await this.repository
        .createQueryBuilder('employee')
        .update(Department)
        .set(data)
        .where('id = :id', { id })
        .execute();

      return { id };
    } catch (err: any) {
      throw new InternalServerErrorException(`Error updating department ${err}`);
    }
  }

  async delete(id: string): Promise<DeleteDepartmentResponseDTO> {
    try {
      await this.repository
        .createQueryBuilder('department')
        .delete()
        .from(Department)
        .where('id = :id', { id })
        .execute();
    } catch (err: any) {
      throw new InternalServerErrorException(`Error Deleting entity ${id}`);
    }

    return { id };
  }
}
