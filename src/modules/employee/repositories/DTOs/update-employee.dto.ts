import { Department } from 'src/modules/departments/department.entity';

export interface UpdateEmployeeRepositoryDTO {
  name: string;
  email: string;
  phone: string;
  department: Department;
  position: string;
  hire_date: string;
}
