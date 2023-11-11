import { Department } from 'src/modules/departments/entities/department.entity';
import { Employee } from 'src/modules/employee/entities/employee.entity';
import { RefreshTokens } from 'src/modules/employee/entities/refresh-token.entity';
import { Role } from 'src/modules/employee/entities/roles.entity';

const department = new Department();
const roles = [new Role(), new Role()];
const refreshToken = new RefreshTokens();

export const makeFakeUser = (): Employee => {
  const user: Employee = {
    id: 'fake-id',
    avatar: 'avatar-url',
    birthDate: '1999-09-09',
    created_at: new Date(),
    department: department,
    hire_date: '2023-06-21',
    email: 'fake-email',
    name: 'fake-name',
    password: 'fake-password',
    phone: 'fake-phone',
    position: 'fake-position',
    roles: roles,
    updated_at: new Date(),
    assignee_tasks: [],
    created_tasks: [],
    refreshToken,
    status: 'active',
  };
  return user;
};
