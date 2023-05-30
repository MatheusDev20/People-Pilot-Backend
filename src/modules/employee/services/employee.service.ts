import { Hashing } from '../../security/interfaces/hashing';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DepartmentsService } from '../../departments/services/department.service';
import { Employee } from '../entities/employee.entity';
import { EmployeeRepository } from '../repositories/employee.repository';
import { DeleteEmployeeResponse, UpdateEmployeeResponse } from '../DTOs/responses.dto';
import { UpdateEmployeeDTO } from '../DTOs/update-employee.dto';
import { UpdateEmployeeRepositoryDTO } from '../repositories/DTOs/update-employee.dto';
import { FindOptionsWhere } from 'typeorm';
import { ValidColumn } from 'src/@types';
import { RegisteredEmail } from 'src/errors/messages';

@Injectable()
export class EmployeeService {
  constructor(
    private departmentService: DepartmentsService,
    private employeeRepository: EmployeeRepository,
    @Inject('HashingService') private hashService: Hashing,
  ) {}

  async find(property: ValidColumn<Employee>, value: string) {
    const options: FindOptionsWhere<Employee> = { [property]: value };
    return await this.employeeRepository.find({ where: options });
  }

  async getEmployeeByDepartment(
    departmentName: string,
    page: number,
    limit: number,
  ): Promise<Employee[]> {
    const department = await this.departmentService.find('name', departmentName);
    if (!department) throw new NotFoundException(`Department ${departmentName} not found`);

    const { id } = department;
    return await this.employeeRepository.getEmployeesByDepartment({
      page,
      limit,
      id,
    });
  }

  async update(id: string, data: Partial<UpdateEmployeeDTO>): Promise<UpdateEmployeeResponse> {
    if (!(await this.find('id', id))) throw new NotFoundException(`Employee ${id} not found`);
    const { email, departmentName } = data;

    // Validar se você vai atualizar pra um Email já existente.
    if (email && (await this.find('email', email))) {
      throw new BadRequestException(RegisteredEmail);
    }
    // Validar se você vai atualizar para um departamento não existente.
    if (departmentName && !(await this.departmentService.find('name', departmentName))) {
      throw new NotFoundException(`Departament ${departmentName} not found`);
    }

    delete data.departmentName;

    const newEmployeeData: Partial<UpdateEmployeeRepositoryDTO> = {
      ...data,
    };
    if (departmentName)
      newEmployeeData.department = await this.departmentService.find('name', departmentName);

    return await this.employeeRepository.updateEmployee(id, newEmployeeData);
  }

  async delete(id: string): Promise<DeleteEmployeeResponse> {
    if (!(await this.find('id', id))) throw new NotFoundException('Employee not found');
    return await this.employeeRepository.delete(id);
  }
}
