import { Injectable } from '@nestjs/common';
import { EmployeeRepository } from '../repositories/employee.repository';
import { UserRoles } from 'src/modules/authentication/DTOs/user-roles';

@Injectable()
export class EmployeePermissionService {
  constructor(private employeeRepository: EmployeeRepository) {}

  async getEmployeeRoles(userId: string): Promise<UserRoles> {
    const roles = (await this.employeeRepository.getRoles(userId)).roles;
    return {
      roles: roles.map((role) => role.name),
    };
  }
}
