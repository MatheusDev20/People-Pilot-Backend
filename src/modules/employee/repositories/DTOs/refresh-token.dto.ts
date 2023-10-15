import { Employee } from '../../entities/employee.entity';

export type CreateRefreshTokenDTO = {
  userId: Employee;
  token: string;
  expiration: string;
};
