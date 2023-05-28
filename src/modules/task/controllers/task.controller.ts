import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LoginGuard } from 'src/modules/authentication/guards/login/login.guard';
import { Roles, Strategy } from 'src/modules/authentication/guards/role-based';
import { RoleGuard } from 'src/modules/authentication/guards/role-based/role.guard';
import { CreateTaskDTO } from '../DTO';

@Strategy('any')
@Controller('/task')
export class TaskController {
  @UseGuards(LoginGuard, RoleGuard)
  @Roles('admin', 'manager')
  @Post('/')
  async create(@Body() data: CreateTaskDTO) {
    return 'Task';
  }
}
