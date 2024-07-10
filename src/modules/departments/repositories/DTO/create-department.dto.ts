import { Employee } from 'src/modules/employee/entities/employee.entity';
import { Organization } from 'src/modules/organizations/entities/organizations.entity';

export interface CreateDepartmentRepositoryDTO {
  name: string;
  description: string;
  manager: Employee;
  organization: Organization;
}
