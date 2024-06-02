import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { HttpResponse, created, deleted, ok, updated } from 'src/helpers/http';
import { DepartmentsService } from '../services/department.service';
import { CreateDepartmentDTO } from '../DTO/create-department.dto';
import { LoginGuard } from 'src/modules/authentication/guards/login/login.guard';
import { Roles } from 'src/modules/authentication/guards/role-based';
import { RoleGuard } from 'src/modules/authentication/guards/role-based/role.guard';
import { UpdateDepartmentDTO } from '../DTO/update-department.dto';
import { FindOneDepartmentDTO } from '../DTO/find-one-department.dto';
import { FindDepartmentUseCase } from '../use-cases/find-department-use-case';
import { DeleteDepartmentResponseDTO } from '../DTO/responses.dto';
import { Department } from '../entities/department.entity';
import { CreateDepartmentUseCase } from '../use-cases/create-department-use-case';
import { Organization } from 'src/modules/organizations/entities/organizations.entity';
import { ORG } from 'src/decorators';

@Controller('departments')
@UseGuards(LoginGuard, RoleGuard)
export class DepartmentsController {
  constructor(
    private service: DepartmentsService,
    private findDepartmentUseCase: FindDepartmentUseCase,
    private createDepartmentUseCase: CreateDepartmentUseCase,
  ) {}

  @Get('/')
  @Roles('managers')
  async listAllDepartments(): Promise<
    HttpResponse<Department[] & { employeeCount: number }>
  > {
    return ok(await this.findDepartmentUseCase.execute({ listAll: true }));
  }

  @Get(':id')
  @Roles('managers')
  async getDepartmentByID(@Param('id', ParseUUIDPipe) uuid: string) {
    const department = await this.findDepartmentUseCase.execute({
      listAll: false,
      id: uuid,
    });

    return ok(department);
  }

  @Post()
  @Roles('managers')
  async post(
    @Body() data: CreateDepartmentDTO,
    @ORG() organization: Organization,
  ) {
    const { id } = await this.createDepartmentUseCase.execute({
      ...data,
      organization: organization,
    });
    return created({ id });
  }

  @Roles('managers')
  @Put(':uuid')
  async update(
    @Param() params: FindOneDepartmentDTO,
    @Body() data: Partial<UpdateDepartmentDTO>,
  ): Promise<HttpResponse<{ id: string }>> {
    const { uuid } = params;
    return updated(await this.service.updateDepartment(uuid, data));
  }

  @Roles('managers')
  @Delete(':uuid')
  async delete(
    @Param() params: FindOneDepartmentDTO,
  ): Promise<HttpResponse<DeleteDepartmentResponseDTO>> {
    const { uuid } = params;
    return deleted(await this.service.delete(uuid));
  }
}
