import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
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
import { FindOneDTO } from '../../../class-validator/find-one.dto';
import { CreateEmployeeService } from '../services/create-employee.service';
import { UploadFileService } from 'src/modules/storage/upload/upload-file';
import { FileInterceptor } from '@nestjs/platform-express';
import { pipeInstance } from '../validations/file-validations';
import { AvatarProfile } from 'src/@types';

@Strategy('any')
@Controller('employee')
export class EmployeeController {
  constructor(
    private employeeService: EmployeeService,
    private createService: CreateEmployeeService,
    private uploadService: UploadFileService,
  ) {}

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
    const { id } = await this.createService.execute(data);
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

  @UseGuards(LoginGuard, RoleGuard)
  @Roles('manager')
  @Patch('/avatar/:uuid')
  @UseInterceptors(FileInterceptor('employee_avatar'))
  async uploadAvatar(
    @UploadedFile(pipeInstance)
    file: AvatarProfile,
    @Param() params: FindOneDTO,
  ): Promise<HttpResponse> {
    const { uuid } = params;
    const fileUrl = await this.uploadService.uploadSingleFile(file, 'employee_avatar');
    const updatedEmployee = await this.employeeService.updateEmployee(uuid, { avatar: fileUrl });
    return updated(updatedEmployee);
  }
}
