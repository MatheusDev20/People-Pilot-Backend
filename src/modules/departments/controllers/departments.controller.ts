import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { HttpResponse, created, deleted, ok, updated } from 'src/helpers/http';
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
  @Roles('admin', 'manager', 'employee')
  async getDepartmentByID(@Param('id', ParseUUIDPipe) uuid: string) {
    return ok(await this.service.find('id', uuid));
  }

  @Post()
  @Roles('admin', 'manager')
  async post(@Body() data: CreateDepartmentDTO) {
    return created(await this.service.createDepartment(data));
  }

  @Roles('admin')
  @Put(':uuid')
  async update(
    @Param() params: FindOneDepartmentDTO,
    @Body() data: Partial<UpdateDepartmentDTO>,
  ): Promise<HttpResponse> {
    const { uuid } = params;
    return updated(await this.service.updateDepartment(uuid, data));
  }

  @Roles('admin')
  @Delete(':uuid')
  async delete(@Param() params: FindOneDepartmentDTO): Promise<HttpResponse> {
    const { uuid } = params;
    return deleted(await this.service.delete(uuid));
  }
}
