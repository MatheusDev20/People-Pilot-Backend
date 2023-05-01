import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { created, HttpResponse, ok } from 'src/helpers/http';
import { CreateEmployeeDTO } from './DTOs/CreateEmployeeDTO';
import { EmployeeService } from './employee.service';

@Controller('employee')
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}
  @Get()
  async getEmployeeByDepartament(@Query() queryParams): Promise<HttpResponse> {
    const employess = await this.employeeService.list(
      queryParams.departmentName,
    );
    return ok(employess);
  }

  @Post()
  async saveEmployee(@Body() data: CreateEmployeeDTO): Promise<HttpResponse> {
    const { id } = await this.employeeService.createEmployee(data);
    return created({ id });
  }
}
