import { Employee } from 'src/modules/employee/entities/employee.entity';

export class JwtData {
  access_token: string;
  expiration: any;
  user: Employee;
}
