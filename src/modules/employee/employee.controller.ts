import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { created, HttpResponse } from 'src/helpers/http';
import { CreateEmployeeDTO } from './DTOs/CreateEmployeeDTO';
import { EmployeeService } from './employee.service';
import { DepartmentsService } from '../departments/department.service';

@Controller('employee')
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}
  @Get()
  async getEmployeeByDepartament(@Query() queryParams): Promise<HttpResponse> {
    const employess = await this.employeeService.list(
      queryParams.departmentName,
    );
    return created(employess);
  }

  @Post()
  async saveEmployee(@Body() data: CreateEmployeeDTO): Promise<HttpResponse> {
    const response = await this.employeeService.createEmployee(data);
    return created(response);
  }
}
