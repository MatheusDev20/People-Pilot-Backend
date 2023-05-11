import { UserType } from '../../enums/user_type';
import { Department } from 'src/modules/departments/department.entity';

export class CreateEmployeeRepositoryDTO {
  name: string;
  email: string;
  password: string;
  phone: string;
  department: Department;
  role: string;
  hire_date?: string;
  user_type?: UserType;
}
