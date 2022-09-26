import { Injectable } from '@nestjs/common';

@Injectable()
export class EmployeeService {
  list() {
    return 'A list of employee has been returned';
  }
}
