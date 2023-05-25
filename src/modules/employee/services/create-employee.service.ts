import { Hashing } from '../../security/interfaces/hashing';
import { CreateEmployeeRepositoryDTO } from '../repositories/DTOs/create-employee.dto';
import { Inject, Injectable } from '@nestjs/common';
import { DepartmentsService } from '../../departments/services/department.service';
import { CreateEmployeeDTO } from '../DTOs/create-employee-dto';
import { EmployeeRepository } from '../repositories/employee.repository';
import { CreateEmployeeResponse } from '../DTOs/responses.dto';
import { Utils } from '../utils/employee.utils';
import { Validations } from '../validations/validations';
import { UploadFileService } from 'src/modules/storage/upload/upload-file';

@Injectable()
export class CreateEmployeeService {
  constructor(
    private departmentService: DepartmentsService,
    private employeeRepository: EmployeeRepository,
    private utils: Utils,
    private validations: Validations,
    @Inject('HashingService') private hashService: Hashing,
    private uploadService: UploadFileService,
  ) {}

  async createEmployee(data: CreateEmployeeDTO): Promise<CreateEmployeeResponse> {
    const { departmentName, password, roles } = data;
    /**
     * If the employee is a manager, attach to a default department (Directory)
     */
    if (await this.utils.isManager(roles)) {
      return await this.createManager(data);
    }
    /**
     * If the employee is not a manager you have to specify the department
     */

    const employeeDepartment = await this.validations.validateDepartmentOnCreation(departmentName);
    delete data.departmentName;
    /**
     * Upload File to S3 Bucket
     */
    const newEmployeeData: CreateEmployeeRepositoryDTO = {
      ...data,
      password: await this.hashService.hash(password),
      department: employeeDepartment,
      roles: await this.utils.pushRoles(roles),
    };

    return await this.employeeRepository.saveEmployee(newEmployeeData);
  }

  private async createManager(
    data: Omit<CreateEmployeeDTO, 'departmentName'>,
  ): Promise<CreateEmployeeResponse> {
    const { password, roles } = data;
    const defaultDepartment = await this.departmentService.getDepartamentByName('Managers');
    const newEmployeeData: CreateEmployeeRepositoryDTO = {
      ...data,
      password: await this.hashService.hash(password),
      department: defaultDepartment,
      roles: await this.utils.pushRoles(roles),
    };

    return await this.employeeRepository.saveEmployee(newEmployeeData);
  }
}
