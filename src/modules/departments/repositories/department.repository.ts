import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Department } from '../department.entity';
import { CreateDepartmentDTO } from '../DTO/create-department.dto';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateDepartmentDTO } from '../DTO/update-department.dto';

@Injectable()
export class DepartmentRepository {
  constructor(@InjectRepository(Department) private repository: Repository<Department>) {}

  async saveDepartment(newDepartmentData: CreateDepartmentDTO) {
    return this.repository.save(newDepartmentData);
  }

  async findDepartment(property: FindOneOptions<Department>): Promise<Department> {
    return this.repository.findOne(property);
  }

  async updateDepartment(id: string, data: Partial<UpdateDepartmentDTO>) {
    try {
      await this.repository
        .createQueryBuilder('employee')
        .update(Department)
        .set(data)
        .where('id = :id', { id })
        .execute();

      return { id };
    } catch (err: any) {
      console.log(err);
      throw new InternalServerErrorException(`Error updating department ${err}`);
    }
  }
}
