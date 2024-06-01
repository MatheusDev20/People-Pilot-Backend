import { Department } from 'src/modules/departments/entities/department.entity';
import { Employee } from 'src/modules/employee/entities/employee.entity';
import { RefreshTokens } from 'src/modules/employee/entities/refresh-token.entity';
import { Role } from 'src/modules/employee/entities/roles.entity';
import { Organization } from 'src/modules/organizations/entities/organizations.entity';

const department = new Department();
const role = new Role();
const organization = new Organization();
const refreshToken = new RefreshTokens();

export const makeFakeUser = (): Employee => {
  const user: Employee = {
    id: 'fake-id',
    avatar: 'avatar-url',
    organization,
    birthDate: '1999-09-09',
    created_at: new Date(),
    department: department,
    hire_date: '2023-06-21',
    email: 'fake-email',
    name: 'fake-name',
    password: 'fake-password',
    phone: 'fake-phone',
    position: 'fake-position',
    role: role,
    updated_at: new Date(),
    assignee_tasks: [],
    created_tasks: [],
    refreshToken,
    status: 'active',
    managedDepartments: [],
    paymentInfo: null,
    documents: null,
  };
  return user;
};
