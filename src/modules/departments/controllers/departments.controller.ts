import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { created, ok } from 'src/helpers/http';
import { DepartmentsService } from '../services/department.service';
import { CreateDepartmentDTO } from '../DTO/create-department.dto';
import { LoginGuard } from 'src/modules/authentication/guards/login/login.guard';
import { Roles } from 'src/modules/authentication/guards/role-based/decorators';
import { RoleGuard } from 'src/modules/authentication/guards/role-based/role.guard';

@Controller('departments')
@UseGuards(RoleGuard)
@UseGuards(LoginGuard)
export class DepartmentsController {
  constructor(private service: DepartmentsService) {}

  @Get(':id')
  async getDepartmentByID(@Param('id', ParseUUIDPipe) uuid: string) {
    return ok(await this.service.getDepartmentById(uuid));
  }

  @Post()
  @Roles('admin', 'manager')
  async postDepartment(@Body() data: CreateDepartmentDTO) {
    return created(await this.service.createDepartment(data));
  }
}
