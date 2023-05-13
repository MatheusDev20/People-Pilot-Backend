import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { created, deleted, HttpResponse, ok, updated } from 'src/helpers/http';
import { CreateEmployeeDTO } from '../DTOs/create-employee-dto';
import { EmployeeService } from '../services/employee.service';
import { DEFAULT_APP_LIMIT, DEFAULT_APP_PAGINATION } from 'src/constants/constants';
import { GetEmployeeByDepartmentDTO } from '../DTOs/get-employees-by-department';
import { LoginGuard } from 'src/modules/authentication/guards/login/login.guard';
import { Roles, Strategy } from 'src/modules/authentication/guards/role-based';
import { RoleGuard } from 'src/modules/authentication/guards/role-based/role.guard';
import { UpdateEmployeeDTO } from '../DTOs/update-employee.dto';
import { FindOneDTO } from '../DTOs/find-one.dto';
@Strategy('any')
@Controller('employee')
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

  /**
   * List of all employes by one department paginated
   */

  @UseGuards(LoginGuard)
  @Get()
  async getByDepartament(@Query() queryParams: GetEmployeeByDepartmentDTO): Promise<HttpResponse> {
    const { name, page, limit } = queryParams;

    const pagination = page ?? DEFAULT_APP_PAGINATION;
    const appLimit = limit ?? DEFAULT_APP_LIMIT;

    const employess = await this.employeeService.getEmployeeByDepartment(
      name,
      pagination,
      appLimit,
    );

    return ok(employess);
  }

  @Post()
  async save(@Body() data: CreateEmployeeDTO): Promise<HttpResponse> {
    const { id } = await this.employeeService.createEmployee(data);
    return created({ id });
  }

  @UseGuards(LoginGuard, RoleGuard)
  @Roles('admin', 'manager', 'simple-user')
  @Get('details')
  async getDetails(@Request() request: Request): Promise<HttpResponse> {
    return ok(`Employee Logged ${request['user'].id}`);
  }

  @UseGuards(LoginGuard, RoleGuard)
  @Roles('admin', 'manager')
  @Put(':uuid')
  async update(
    @Param() params: FindOneDTO,
    @Body() data: Partial<UpdateEmployeeDTO>,
  ): Promise<HttpResponse> {
    const { uuid } = params;
    const { id } = await this.employeeService.updateEmployee(uuid, data);
    return updated({ id });
  }

  @UseGuards(LoginGuard, RoleGuard)
  @Roles('admin')
  @Delete(':uuid')
  async delete(@Param() params: FindOneDTO): Promise<HttpResponse> {
    const { uuid } = params;
    return deleted(await this.employeeService.delete(uuid));
  }
}
