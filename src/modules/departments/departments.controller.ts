import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { created, ok } from 'src/helpers/http';
import { DepartmentsService } from './department.service';
import { CreateDepartmentDTO } from './DTO/create-department.dto';
@Controller('departments')
export class DepartmentsController {
  constructor(private service: DepartmentsService) {}

  @Get(':id')
  async getDepartmentByID(@Param('id', ParseUUIDPipe) uuid: string) {
    const response = await this.service.getDepartmentById(uuid);
    return ok(response);
  }

  @Post()
  async postDepartment(@Body() data: CreateDepartmentDTO) {
    const response = await this.service.createDepartment(data);
    return created(response);
  }
}
