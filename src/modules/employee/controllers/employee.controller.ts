import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { created, deleted, HttpResponse, ok, updated } from 'src/helpers/http';
import { CreateEmployeeDTO } from '../DTOs/create-employee-dto';
import { EmployeeService } from '../services/employee.service';
import {
  DEFAULT_APP_LIMIT,
  DEFAULT_APP_PAGINATION,
} from 'src/constants/constants';
import { GetEmployeeListDTO } from '../DTOs/get-employees-by-department';
import { LoginGuard } from 'src/modules/authentication/guards/login/login.guard';
import { Roles } from 'src/modules/authentication/guards/role-based';
import { RoleGuard } from 'src/modules/authentication/guards/role-based/role.guard';
import { UpdateEmployeeDTO } from '../DTOs/update-employee.dto';
import { FindOneDTO } from '../../../class-validator/find-one.dto';
import { UploadFileService } from 'src/modules/storage/upload/upload-file';
import { FileInterceptor } from '@nestjs/platform-express';
import { pipeInstance } from '../../storage/file-validations';
import { AvatarProfile } from 'src/@types';
import { CreateEmployeeUseCase } from '../use-cases/create-employee-use-case';
import { CreateManagerUseCase } from '../use-cases/create-manager-use-case';
import { GetEmployeeListUseCase } from '../use-cases/get-employee-list-use-case';
import { PaymentInfoDTO } from '../DTOs/payment-info-dto';
import { AddPaymentInformation } from '../use-cases/add-payment-information-use-case';

@Controller('employee')
export class EmployeeController {
  constructor(
    private employeeService: EmployeeService,
    private createEmployeeUseCase: CreateEmployeeUseCase,
    private createManagerUseCase: CreateManagerUseCase,
    private listEmployeesUseCase: GetEmployeeListUseCase,
    private uploadService: UploadFileService,
    private addPaymentInfoUseCase: AddPaymentInformation,
  ) {}

  /**
   * List of all employes by one department paginated
   */

  @UseGuards(LoginGuard)
  @Get('me')
  @UseInterceptors(ClassSerializerInterceptor)
  async getMe(@Req() request): Promise<HttpResponse> {
    const { id } = request.user;
    const me = await this.employeeService.find('id', id);
    return ok(me);
  }

  @UseGuards(LoginGuard)
  @Get()
  async getEmployeeList(
    @Query() queryParams: GetEmployeeListDTO,
  ): Promise<HttpResponse> {
    const { departmentName, page, limit, role } = queryParams;

    const pagination = page ?? DEFAULT_APP_PAGINATION;
    const appLimit = limit ?? DEFAULT_APP_LIMIT;

    const employess = await this.listEmployeesUseCase.execute({
      departmentName,
      page: pagination,
      limit: appLimit,
      role: role ?? null,
    });

    return ok(employess);
  }

  @Post()
  async save(@Body() data: CreateEmployeeDTO): Promise<HttpResponse> {
    const { role } = data;
    if (role === 'managers' || role === 'admin') {
      const { id } = await this.createManagerUseCase.execute(data);
      return created({ id });
    }

    const { id } = await this.createEmployeeUseCase.execute(data);
    return created({ id });
  }

  @UseGuards(LoginGuard, RoleGuard)
  @Roles('managers')
  @Get('details/:uuid')
  @UseInterceptors(ClassSerializerInterceptor)
  async getDetails(@Param() params: FindOneDTO): Promise<HttpResponse> {
    return ok(await this.employeeService.getDetails(params.uuid));
  }

  @UseGuards(LoginGuard, RoleGuard)
  @Roles('managers')
  @Put(':uuid')
  async update(
    @Param() params: FindOneDTO,
    @Body() data: Partial<UpdateEmployeeDTO>,
  ): Promise<HttpResponse> {
    const { uuid } = params;
    const { id } = await this.employeeService.update(uuid, data);
    return updated({ id });
  }

  @UseGuards(LoginGuard, RoleGuard)
  @Roles('managers')
  @Delete(':uuid')
  async delete(@Param() params: FindOneDTO): Promise<HttpResponse> {
    const { uuid } = params;
    return deleted(await this.employeeService.delete(uuid));
  }

  @UseGuards(LoginGuard, RoleGuard)
  @Roles('managers')
  @Patch('/avatar/:uuid')
  @UseInterceptors(FileInterceptor('employee_avatar'))
  async uploadAvatar(
    @UploadedFile(pipeInstance)
    file: AvatarProfile,
    @Param() params: FindOneDTO,
  ): Promise<HttpResponse> {
    const { uuid } = params;
    const fileUrl = await this.uploadService.uploadSingleFile(
      file,
      'employee_avatar',
    );
    const updatedEmployee = await this.employeeService.update(uuid, {
      avatar: fileUrl,
    });
    return updated(updatedEmployee);
  }

  @UseGuards(LoginGuard, RoleGuard)
  @Roles('managers')
  @Post('/payment-info/:uuid')
  async addEmployeePaymentInfo(
    @Param() params: FindOneDTO,
    @Body() data: PaymentInfoDTO,
  ) {
    const { uuid } = params;
    await this.addPaymentInfoUseCase.execute({
      employeeId: uuid,
      paymentInfo: data,
    });
  }
}
