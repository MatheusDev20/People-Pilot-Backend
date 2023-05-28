import { Body, Controller, Delete, Param, Post, Request, UseGuards } from '@nestjs/common';
import { LoginGuard } from 'src/modules/authentication/guards/login/login.guard';
import { Roles, Strategy } from 'src/modules/authentication/guards/role-based';
import { RoleGuard } from 'src/modules/authentication/guards/role-based/role.guard';
import { CreateTaskDTO } from '../DTO';
import { CreateTaskService } from '../services/create-task.service';
import { Request as Req } from 'express';
import { TaskService } from '../services/task.service';
import { FindOneDTO } from 'src/class-validator/find-one.dto';
import { HttpResponse, created, deleted } from 'src/helpers/http';

@Strategy('any')
@Controller('/task')
export class TaskController {
  constructor(private createService: CreateTaskService, private taskService: TaskService) {}
  @UseGuards(LoginGuard, RoleGuard)
  @Roles('admin', 'manager')
  @Post('/')
  async create(@Request() request: Req, @Body() data: CreateTaskDTO): Promise<HttpResponse> {
    return created(await this.createService.execute({ ...data, createdBy: request['user'].id }));
  }

  @UseGuards(LoginGuard, RoleGuard)
  @Roles('admin', 'manager')
  @Delete(':uuid')
  async delete(@Param() params: FindOneDTO): Promise<HttpResponse> {
    const { uuid } = params;
    return deleted(await this.taskService.delete(uuid));
  }
}
