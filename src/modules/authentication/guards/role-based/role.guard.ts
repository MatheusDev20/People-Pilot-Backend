import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
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
    if (!this.reflector.get<string[]>('roles', context.getHandler()))
      return true;

    const request: Request = context.switchToHttp().getRequest();
    const roles = await this.getUserRoles(request['user'].id);
    console.log('Roles do cara logado', roles);

    return true;
  }

  async getUserRoles(userId: string): Promise<UserRoles> {
    return await this.permissionsService.getEmployeeRoles(userId);
  }
}
