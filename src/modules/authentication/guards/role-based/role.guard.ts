import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { EmployeeRepository } from 'src/modules/employee/repositories/employee.repository';
import { RoleType } from 'src/@types';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private repository: EmployeeRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRole = this.reflector.get<RoleType>(
      'role',
      context.getHandler(),
    );
    /* Rota permissiva */
    if (!requiredRole) return true;

    const request: Request = context.switchToHttp().getRequest();
    const id = request['user'].id;
    const user = await this.repository.find(
      {
        where: { id },
      },
      { role: true },
    );
    const { role } = user;
    if (role.name === 'admin') return true;
    if (requiredRole === role.name) return true;

    return false;
  }
}
