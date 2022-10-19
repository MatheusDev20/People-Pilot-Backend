import { Body, Controller, Get, Post } from '@nestjs/common';
import { created } from '../../helpers/http';
import { HttpResponse } from 'src/helpers/http/http-helpers';
import { CreateRoleDTO } from './DTOs/CreateRoleDTO';
import { RoleService } from './role.service';

@Controller('roles')
export class RolesController {
  constructor(private service: RoleService) {}
  @Get()
  getAll(): string {
    return 'All Roles';
  }

  @Post()
  async createRole(
    @Body() createRoleDTO: CreateRoleDTO,
  ): Promise<HttpResponse> {
    const role = await this.service.createRole(createRoleDTO);
    return created(role);
  }
}
