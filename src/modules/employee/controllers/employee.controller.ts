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
import { UploadFileService } from 'src/modules/storage/upload-file';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  AvatarPipeInstance,
  DocumentPipeInstance,
} from '../../storage/file-validations';
import { AvatarProfile, EmployeeDocument } from 'src/@types';
import { CreateEmployeeUseCase } from '../use-cases/create-employee-use-case';
import { CreateManagerUseCase } from '../use-cases/create-manager-use-case';
import { GetEmployeeListUseCase } from '../use-cases/search/get-employee-list-use-case';
import { PaymentInfoDTO } from '../DTOs/payment-info-dto';
import { AddPaymentInformation } from '../use-cases/add-payment-information-use-case';
import { UploadDocumentDTO } from '../DTOs/update-document-dto';
import { UploadDocumentUseCase } from '../use-cases/upload-document-use-case';
import { Employee } from '../entities/employee.entity';
import { DeleteEmployeeResponse, UpdateEmployeeResponse } from '../DTOs';
import { FindByPropertyEmployeeUseCase } from '../use-cases/search/find-employee-use-case';
import { UpdateEmployeeUseCase } from '../use-cases/update-employee-use-case';
import { DeleteEmployeeUseCase } from '../use-cases/delete-employee-use-case';

@Controller('employee')
export class EmployeeController {
  constructor(
    private createEmployeeUseCase: CreateEmployeeUseCase,
    private createManagerUseCase: CreateManagerUseCase,
    private listEmployeesUseCase: GetEmployeeListUseCase,
    private uploadService: UploadFileService,
    private addPaymentInfoUseCase: AddPaymentInformation,
    private uploadDocumentUseCase: UploadDocumentUseCase,
    private findByPropertyUseCase: FindByPropertyEmployeeUseCase,
    private updateEmployeeUseCase: UpdateEmployeeUseCase,
    private deleteEmployeeUseCase: DeleteEmployeeUseCase,
  ) {}

  /**
   * List of all employes by one department paginated
   */

  @UseGuards(LoginGuard)
  @Get('me')
  @UseInterceptors(ClassSerializerInterceptor)
  async getMe(@Req() request): Promise<HttpResponse<Employee>> {
    const { id } = request.user;
    const me = await this.findByPropertyUseCase.execute('id', id, {
      bringDetails: false,
    });

    return ok(me);
  }

  @UseGuards(LoginGuard)
  @Get()
  async getEmployeeList(
    @Query() queryParams: GetEmployeeListDTO,
  ): Promise<HttpResponse<Employee>> {
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
  async save(
    @Body() data: CreateEmployeeDTO,
  ): Promise<HttpResponse<{ id: string }>> {
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
  async getDetails(
    @Param() params: FindOneDTO,
  ): Promise<HttpResponse<Employee>> {
    const details = await this.findByPropertyUseCase.execute(
      'id',
      params.uuid,
      {
        bringDetails: true,
      },
    );
    return ok(details);
  }

  @UseGuards(LoginGuard, RoleGuard)
  @Roles('managers')
  @Put(':uuid')
  async update(
    @Param() params: FindOneDTO,
    @Body() data: Partial<UpdateEmployeeDTO>,
  ): Promise<HttpResponse<{ id: string }>> {
    const { uuid } = params;
    const { id } = await this.updateEmployeeUseCase.execute(uuid, data);
    return updated({ id });
  }

  @UseGuards(LoginGuard, RoleGuard)
  @Roles('managers')
  @Delete(':uuid')
  async delete(
    @Param() params: FindOneDTO,
  ): Promise<HttpResponse<DeleteEmployeeResponse>> {
    const { uuid } = params;
    const { id } = await this.deleteEmployeeUseCase.execute(uuid);
    return deleted({ id });
  }

  @UseGuards(LoginGuard, RoleGuard)
  @Roles('managers')
  @Patch('/avatar/:uuid')
  @UseInterceptors(FileInterceptor('employee_avatar'))
  async uploadAvatar(
    @UploadedFile(AvatarPipeInstance)
    file: AvatarProfile,
    @Param() params: FindOneDTO,
  ): Promise<HttpResponse<UpdateEmployeeResponse>> {
    const { uuid } = params;
    const fileUrl = await this.uploadService.uploadSingleFile(
      file,
      'employee_avatar',
    );

    const updatedEmployee = await this.updateEmployeeUseCase.execute(uuid, {
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
    const { id } = await this.addPaymentInfoUseCase.execute({
      employeeId: uuid,
      paymentInfo: data,
    });

    return updated({ updatedEmployeeId: id });
  }

  @UseGuards(LoginGuard, RoleGuard)
  @Roles('managers')
  @Get('/payment-info/available-banks')
  async getAvailableBanks() {
    return ok(await this.addPaymentInfoUseCase.listAvailableBanks());
  }

  @UseGuards(LoginGuard, RoleGuard)
  @Roles('managers')
  @Post('/:uuid/documents')
  @UseInterceptors(FileInterceptor('document'))
  async uploadDocument(
    @UploadedFile(DocumentPipeInstance)
    file: EmployeeDocument,
    @Body() data: UploadDocumentDTO,
    @Param() params: FindOneDTO,
  ): Promise<HttpResponse<{ docIdentifierId: string }>> {
    const { uuid } = params;
    const { docIdentifierId } = await this.uploadDocumentUseCase.execute({
      id: uuid,
      data,
      file,
    });

    return created({ docIdentifierId });
  }
}
