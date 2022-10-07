import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { DepartmentsService } from './department.service';
import { CreateDepartmentDTO } from './DTO/create-department.dto';
@Controller('departments')
export class DepartmentsController {
  constructor(private service: DepartmentsService) {}

  @Get()
  getDepartments() {
    return 'All Departments';
  }

  @Post()
  async postDepartment(@Body() data: CreateDepartmentDTO) {
    console.log(data);
    await this.service.createDepartment(data);
  }
}
