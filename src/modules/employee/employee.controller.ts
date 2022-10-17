import { Body, Controller, Get, Post } from '@nestjs/common';
import { created, HttpResponse } from 'src/helpers/http';
import { CreateEmployeeDTO } from './DTOs/CreateEmployeeDTO';
import { EmployeeService } from './employee.service';

@Controller('employee')
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}
  @Get()
  getEmployee(): string {
    return this.employeeService.list();
  }
  @Post()
  async saveEmployee(@Body() data: CreateEmployeeDTO): Promise<HttpResponse> {
    // return await this.employeeService.createEmployee();
    return created({});
  }
}
