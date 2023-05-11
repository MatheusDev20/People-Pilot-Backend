import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { created, HttpResponse, ok } from 'src/helpers/http';
import { CreateEmployeeDTO } from '../DTOs/create-employee-dto';
import { EmployeeService } from '../services/employee.service';
import {
  DEFAULT_APP_LIMIT,
  DEFAULT_APP_PAGINATION,
} from 'src/constants/constants';
import { GetEmployeeByDepartmentDTO } from '../DTOs/get-employees-by-department';
import { LoginGuard } from 'src/modules/authentication/guards/login.guard';

@Controller('employee')
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

  @Get()
  @UseGuards(LoginGuard)
  /**
   * List of all employes by one department paginated
   */
  async getEmployeesByDepartament(
    @Query() queryParams: GetEmployeeByDepartmentDTO,
  ): Promise<HttpResponse> {
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
  async saveEmployee(@Body() data: CreateEmployeeDTO): Promise<HttpResponse> {
    const { id } = await this.employeeService.createEmployee(data);
    return created({ id });
  }

  @UseGuards(LoginGuard)
  @Get('details')
  async getEmployeeDetails(@Request() request: Request): Promise<HttpResponse> {
    return ok('Employee Details');
  }
}
