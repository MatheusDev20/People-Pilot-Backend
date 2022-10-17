import { Body, Controller, Get, Post } from '@nestjs/common';
import { created } from 'src/helpers/http';
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
    const response = await this.service.createDepartment(data);
    return created(response);
  }
}
