import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Put, UseGuards } from '@nestjs/common';
import { created, ok, updated } from 'src/helpers/http';
import { DepartmentsService } from '../services/department.service';
import { CreateDepartmentDTO } from '../DTO/create-department.dto';
import { LoginGuard } from 'src/modules/authentication/guards/login/login.guard';
import { Roles, Strategy } from 'src/modules/authentication/guards/role-based';
import { RoleGuard } from 'src/modules/authentication/guards/role-based/role.guard';
import { UpdateDepartmentDTO } from '../DTO/update-department.dto';
import { FindOneDepartmentDTO } from '../DTO/find-one-department.dto';

@Strategy('any')
@Controller('departments')
@UseGuards(LoginGuard, RoleGuard)
export class DepartmentsController {
  constructor(private service: DepartmentsService) {}

  @Get(':id')
  @Roles('admin', 'manager', 'simple-user')
  async getDepartmentByID(@Param('id', ParseUUIDPipe) uuid: string) {
    return ok(await this.service.getDepartmentById(uuid));
  }

  @Post()
  @Roles('admin', 'manager')
  async postDepartment(@Body() data: CreateDepartmentDTO) {
    return created(await this.service.createDepartment(data));
  }

  @Roles('admin')
  @Put(':uuid')
  async updateDepartment(
    @Param() params: FindOneDepartmentDTO,
    @Body() data: Partial<UpdateDepartmentDTO>,
  ) {
    const { uuid } = params;
    return updated(await this.service.updateDepartment(uuid, data));
  }
}
