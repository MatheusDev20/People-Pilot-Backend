import { Employee } from 'src/modules/employee/entities/employee.entity';

export interface UpdateDepartmentRepositoryDTO {
  name: string;
  description: string;
  manager: Employee;
}
