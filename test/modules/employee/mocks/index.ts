import { CreateEmployeeDTO } from 'src/modules/employee/DTOs/create-employee-dto';
import { UpdateEmployeeDTO } from 'src/modules/employee/DTOs/update-employee.dto';
import { RefreshTokens } from 'src/modules/employee/entities/refresh-token.entity';
import { Employee } from 'src/modules/employee/entities/employee.entity';
import { GetEmployeeListDTO } from 'src/modules/employee/DTOs/get-employees-by-department';

export const makeFakeGetDepartmentRequest = (): GetEmployeeListDTO => {
  return {
    departmentName: 'fake-department',
    limit: 10,
    page: 1,
  };
};

export const makeFakeEmployee = (): CreateEmployeeDTO => {
  return {
    name: 'fake-input',
    departmentName: 'fake-department-name',
    birthDate: '1999-09-09',
    email: 'fake-email',
    hire_date: 'fake-hire-date',
    password: 'fake-password',
    phone: 'fake-phone',
    position: 'fake-position',
    role: 'fake-role',
  };
};

export const makeFakeupdateEmployee = (): Partial<UpdateEmployeeDTO> => {
  return {
    email: 'MakeFakeEmail',
  };
};

export const makeRefreshToken = (): RefreshTokens => ({
  expiration: '7d',
  id: 'uuid',
  token: 'random_refresh_token',
  userId: new Employee(),
});
