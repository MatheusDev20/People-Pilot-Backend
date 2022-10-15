import { Body, Controller, Get, Post } from '@nestjs/common';
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
  createRole(@Body() createRoleDTO: CreateRoleDTO): Promise<void> {
    return this.service.createRole(createRoleDTO);
  }
}
