import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateDepartmentDTO } from '../DTO/update-department.dto';
import { DepartmentRepository } from '../repositories/department.repository';

@Injectable()
export class DepartmentValidations {
  constructor(private departmentService: DepartmentRepository) {}

  async validateDepartmentEntry(data: Partial<UpdateDepartmentDTO>) {
    const { name } = data;
    if (name && (await this.departmentService.findDepartment({ where: { name: name } }))) {
      throw new BadRequestException(`Department ${name} already exists`);
    }
  }
}
