import { Employee } from 'src/modules/employee/entities/employee.entity';

export interface CreateDepartmentRepositoryDTO {
  name: string;
  description: string;
  manager: Employee;
}
