import { Controller, Get } from '@nestjs/common';

@Controller('roles')
export class RolesController {
  @Get()
  getAll(): string {
    return 'All Roles';
  }
}
