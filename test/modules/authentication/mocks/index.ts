import { Roles } from 'src/modules/authentication/guards/role-based';
import { Department } from 'src/modules/departments/entities/department.entity';
import { Employee } from 'src/modules/employee/entities/employee.entity';
import { Role } from 'src/modules/employee/entities/roles.entity';

const department = new Department();
const roles = [new Role(), new Role()];
export const makeFakeUser = (): Employee => {
  const user: Employee = {
    id: 'fake-id',
    avatar: 'avatar-url',
    created_at: new Date(),
    department: department,
    hire_date: new Date(),
    email: 'fake-email',
    name: 'fake-name',
    password: 'fake-password',
    phone: 'fake-phone',
    position: 'fake-position',
    roles: roles,
    updated_at: new Date(),
    assignee_tasks: [],
    created_tasks: [],
  };
  return user;
};
