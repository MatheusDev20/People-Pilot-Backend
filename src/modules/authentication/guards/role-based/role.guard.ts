import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { UserRoles } from '../../DTOs/user-roles';
import { EmployeePermissionService } from 'src/modules/employee/services/employee-permissions.service';

@Injectable()
export class RoleGuard implements CanActivate {
  private logger = new Logger();
  constructor(
    private reflector: Reflector,
    private permissionsService: EmployeePermissionService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    const strategy = this.reflector.get<string>('strategy', context.getClass());

    if (!requiredRoles) return true;

    const request: Request = context.switchToHttp().getRequest();
    const { roles } = await this.getUserRoles(request['user'].id);
    console.log(strategy);
    switch (strategy) {
      case 'any':
        return this.matchAny(requiredRoles, roles);

      case 'all':
        return this.matchAll(requiredRoles, roles);
    }
  }

  async getUserRoles(userId: string): Promise<UserRoles> {
    return await this.permissionsService.getEmployeeRoles(userId);
  }

  matchAny = (requiredRoles: string[], userRoles: string[]): boolean => {
    for (const role of userRoles) {
      if (requiredRoles.includes(role)) return true;
    }
    return false;
  };

  matchAll = (requiredRoles: string[], userRoles: string[]): boolean => {
    return requiredRoles.every((role) => userRoles.includes(role));
  };
}
