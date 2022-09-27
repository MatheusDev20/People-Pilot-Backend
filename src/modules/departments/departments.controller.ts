import { Controller, Get } from '@nestjs/common';

@Controller('departments')
export class DepartmentsController {
  @Get()
  getDepartments() {
    return 'All Departments';
  }
}
