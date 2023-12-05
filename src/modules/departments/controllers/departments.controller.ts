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
import { Roles } from 'src/modules/authentication/guards/role-based';
import { RoleGuard } from 'src/modules/authentication/guards/role-based/role.guard';
import { UpdateDepartmentDTO } from '../DTO/update-department.dto';
import { FindOneDepartmentDTO } from '../DTO/find-one-department.dto';
import { ListAllDepartmentsUseCase } from '../use-cases/listAll-use-case';

@Controller('departments')
@UseGuards(LoginGuard, RoleGuard)
export class DepartmentsController {
  constructor(
    private service: DepartmentsService,
    private listAllUseCase: ListAllDepartmentsUseCase,
  ) {}

  @Get('/')
  @Roles('manager')
  async listAllDepartments() {
    return ok(await this.listAllUseCase.execute());
  }

  @Get(':id')
  @Roles('manager')
  async getDepartmentByID(@Param('id', ParseUUIDPipe) uuid: string) {
    return ok(await this.service.find('id', uuid));
  }

  @Post()
  @Roles('admin')
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
