import { Role } from '../../entities/roles.entity';
import { Department } from 'src/modules/departments/entities/department.entity';
import { Employee } from '../../entities/employee.entity';
import { Organization } from 'src/modules/organizations/entities/organizations.entity';

export class CreateEmployeeRepositoryDTO {
  name: string;
  email: string;
  password: string;
  phone: string;
  department: Department;
  organization: Organization;
  position: string;
  role: Role;
  hire_date?: string;
  status: string;
}
export type GetAllEmployesDTO = {
  page: number;
  limit: number;
};

export type GetDtoByDepartment = GetAllEmployesDTO & {
  departmentId: string;
};

export interface UpdateEmployeeRepositoryDTO {
  name: string;
  email: string;
  phone: string;
  department: Department;
  position: string;
  hire_date: string;
  avatar: string;
  refreshToken: Employee;
}

type BaseFilter = {
  page: number;
  limit: number;
};

export type ListFilterOptions = BaseFilter & {
  department: string;
  role: number;
};
