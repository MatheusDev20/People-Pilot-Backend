import { Role } from '../../entities/roles.entity';
import { Department } from 'src/modules/departments/entities/department.entity';

export class CreateEmployeeRepositoryDTO {
  name: string;
  email: string;
  password: string;
  phone: string;
  department: Department;
  position: string;
  roles: Role[];
  hire_date?: string;
}
