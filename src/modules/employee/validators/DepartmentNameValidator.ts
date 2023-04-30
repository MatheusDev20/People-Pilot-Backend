import { ValidatorConstraintInterface } from 'class-validator';
import { DepartmentsService } from '../../departments/department.service';

export class DepartmentNameValidator implements ValidatorConstraintInterface {
  private service: DepartmentsService;
  constructor(departmentService: DepartmentsService) {
    this.service = departmentService;
  }
  async validate(name: string): Promise<boolean> {
    const department = await this.service.getDepartamentByName(name);
    console.log('Department on Validator', department);
    return !!department;
  }
}
