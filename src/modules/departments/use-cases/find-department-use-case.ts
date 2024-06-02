import { Injectable } from '@nestjs/common';
import { DepartmentRepository } from '../repositories/department.repository';
import { Department } from '../entities/department.entity';

type Input = {
  listAll: boolean;
  id?: string;
};

@Injectable()
export class FindDepartmentUseCase {
  constructor(private repository: DepartmentRepository) {}

  async execute({ listAll, id }: Input): Promise<Department | Department[]> {
    if (listAll && !id) {
      const response = await this.repository.findAll();
      const departments = response
        .filter((department) => department.name !== 'Managers')
        .map((data) => ({
          ...data,
          employeeCount: data.employees.length,
        }));

      return departments;
    }

    return this.repository.find({ where: { id } });
  }
}
