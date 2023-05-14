import { BadRequestException, Injectable } from '@nestjs/common';
import { RolesRepository } from '../repositories/roles.repository';
import { Role } from '../entities/roles.entity';

@Injectable()
export class Utils {
  constructor(private rolesRepository: RolesRepository) {}

  async pushRoles(roles: string): Promise<Role[]> {
    const userRoles: Role[] = [];
    for (const role of roles.split(',')) {
      const findRole = await this.rolesRepository.findRole(role);
      if (!findRole) {
        throw new BadRequestException('Desired role not found');
      }
      userRoles.push(findRole);
    }
    return userRoles;
  }

  async isManager(roles: string): Promise<boolean> {
    const rolesArr = roles.split(',');
    return rolesArr.includes('manager');
  }
}
