import { CreateManagerUseCase } from './../../../src/modules/employee/use-cases/create-manager-use-case';
import { EmployeeRepository } from 'src/modules/employee/repositories/employee.repository';
import { EmployeeService } from './../../../src/modules/employee/services/employee.service';
import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeController } from 'src/modules/employee/controllers/employee.controller';
import { makeFakeUser } from '../authentication/mocks';
import { Employee } from 'src/modules/employee/entities/employee.entity';
import { SecurityModule } from 'src/modules/security/security.module';
import { LoggerModule } from 'src/modules/logger/logger.module';
import { ConfigModule } from '@nestjs/config';

import { StorageModule } from 'src/modules/storage/storage.module';
import {
  makeFakeEmployee,
  makeFakeGetDepartmentRequest,
  makeFakeupdateEmployee,
  mockFile,
} from './mocks';
import { v4 } from 'uuid';
import { FindOneDTO } from 'src/class-validator/find-one.dto';
import { UpdateEmployeeResponse } from 'src/modules/employee/DTOs/responses.dto';
import { CreateEmployeeUseCase } from 'src/modules/employee/use-cases/create-employee-use-case';
import { GetEmployeeListUseCase } from 'src/modules/employee/use-cases/get-employee-list-use-case';
import { AddPaymentInformation } from 'src/modules/employee/use-cases/add-payment-information-use-case';
import { UploadDocumentUseCase } from 'src/modules/employee/use-cases';
import { InternalServerErrorException } from '@nestjs/common';

describe('Employee Controller', () => {
  let sut: EmployeeController;
  let employeeService: EmployeeService;
  let useCase: CreateEmployeeUseCase;
  let listEmployeeUseCase: GetEmployeeListUseCase;
  let uploadDocumentUseCase: UploadDocumentUseCase;

  class ServiceStub {
    async getEmployeeByDepartment(): Promise<Employee[]> {
      return new Promise((resolve) =>
        resolve([makeFakeUser(), makeFakeUser()]),
      );
    }
    async getDetails(): Promise<Employee> {
      return new Promise((resolve) => resolve(makeFakeUser()));
    }

    async update(): Promise<UpdateEmployeeResponse> {
      return new Promise((resolve) => resolve({ id: 'updated-id' }));
    }
    async delete() {
      return new Promise((resolve) => resolve('Deleted'));
    }
  }
  class CreateEmployeeUseCaseStub {
    async execute() {
      return new Promise((resolve) => resolve('OK'));
    }
  }
  class CreateManagerUseCaseStub {
    async execute() {
      return new Promise((resolve) => resolve('OK'));
    }
  }
  class ListEmployeeUseCaseStub {
    async execute() {
      return new Promise((resolve) => resolve('OK'));
    }
  }
  class EmployeeRepositoryStub {
    async find() {
      return new Promise((resolve) => resolve(makeFakeUser()));
    }
  }

  class AddPaymentInfoStub {
    async execute() {
      return new Promise((resolve) => resolve('OK'));
    }
  }
  class UploadDocumentUseCaseStub {
    async execute() {
      return new Promise((resolve) => resolve('OK'));
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        LoggerModule,
        SecurityModule,
        StorageModule,
      ],
      controllers: [EmployeeController],
      providers: [
        {
          provide: CreateEmployeeUseCase,
          useClass: CreateEmployeeUseCaseStub,
        },
        {
          provide: GetEmployeeListUseCase,
          useClass: ListEmployeeUseCaseStub,
        },
        {
          provide: CreateManagerUseCase,
          useClass: CreateManagerUseCaseStub,
        },
        {
          provide: EmployeeService,
          useClass: ServiceStub,
        },
        {
          provide: EmployeeRepository,
          useClass: EmployeeRepositoryStub,
        },
        {
          provide: AddPaymentInformation,
          useClass: AddPaymentInfoStub,
        },
        {
          provide: UploadDocumentUseCase,
          useClass: UploadDocumentUseCaseStub,
        },
      ],
    }).compile();

    sut = module.get<EmployeeController>(EmployeeController);
    employeeService = module.get<EmployeeService>(EmployeeService);
    useCase = module.get<CreateEmployeeUseCase>(CreateEmployeeUseCase);
    listEmployeeUseCase = module.get<GetEmployeeListUseCase>(
      GetEmployeeListUseCase,
    );
    uploadDocumentUseCase = module.get<UploadDocumentUseCase>(
      UploadDocumentUseCase,
    );
  });

  it('Should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('Should call excute the employee List use case with the right arguments', async () => {
    const fakeData = makeFakeGetDepartmentRequest();
    const spy = jest.spyOn(sut, 'getEmployeeList');
    const serviceSpy = jest.spyOn(listEmployeeUseCase, 'execute');
    await sut.getEmployeeList(fakeData);

    expect.assertions(3);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(fakeData);
    expect(serviceSpy).toHaveBeenCalled();
  });

  it('Should call save with the right arguments', async () => {
    const fakeData = makeFakeEmployee();
    const spy = jest.spyOn(sut, 'save');
    const useCaseSpy = jest.spyOn(useCase, 'execute');
    await sut.save(fakeData);

    expect.assertions(3);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(fakeData);
    expect(useCaseSpy).toHaveBeenCalled();
  });

  it('Should call getDetails with the right arguments', async () => {
    const uuid = v4();
    const spy = jest.spyOn(sut, 'getDetails');
    const serviceSpy = jest.spyOn(employeeService, 'getDetails');
    const params: FindOneDTO = { uuid };
    await sut.getDetails(params);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ uuid });
    expect(serviceSpy).toHaveBeenCalled();

    expect.assertions(3);
  });

  it('Should call update with the right arguments', async () => {
    const uuid = v4();
    const spy = jest.spyOn(sut, 'update');
    const serviceSpy = jest.spyOn(employeeService, 'update');
    const params: FindOneDTO = { uuid };
    const fakeUpdateData = makeFakeupdateEmployee();
    await sut.update(params, fakeUpdateData);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(params, fakeUpdateData);
    expect(serviceSpy).toHaveBeenCalled();

    expect.assertions(3);
  });

  it('Should call delete with the right arguments', async () => {
    const uuid = v4();
    const spy = jest.spyOn(sut, 'delete');
    const serviceSpy = jest.spyOn(employeeService, 'delete');
    const params: FindOneDTO = { uuid };
    await sut.delete(params);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({ uuid });
    expect(serviceSpy).toHaveBeenCalled();

    expect.assertions(3);
  });

  it('Should call uploadDocument execute useCase with the Rigth arguments', async () => {
    const params: FindOneDTO = { uuid: v4() };
    const uploadData = {
      documentType: 'cpf',
      metadata: { cpf: '123456789' },
    };

    const file = mockFile();
    jest.spyOn(uploadDocumentUseCase, 'execute');
    await sut.uploadDocument(file, uploadData, params);
    expect(uploadDocumentUseCase.execute).toHaveBeenCalledWith({
      id: params.uuid,
      data: uploadData,
      file,
    });
    expect(uploadDocumentUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it('Should return the Document Identifer for the recent uploaded document', async () => {
    const params: FindOneDTO = { uuid: v4() };
    const uploadData = {
      documentType: 'cpf',
      metadata: { cpf: '123456789' },
    };

    const file = mockFile();
    jest
      .spyOn(uploadDocumentUseCase, 'execute')
      .mockResolvedValue({ docIdentifierId: 'ID123' });

    const response = await sut.uploadDocument(file, uploadData, params);
    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual({ docIdentifierId: 'ID123' });
    expect(response.message).toEqual('Sucessfully Created!');
  });

  it('Should Throw an Error if the uploadDocument use case fails', async () => {
    const params: FindOneDTO = { uuid: v4() };
    const uploadData = {
      documentType: 'cpf',
      metadata: { cpf: '123456789' },
    };

    const file = mockFile();
    jest.spyOn(uploadDocumentUseCase, 'execute').mockImplementationOnce(() => {
      throw new InternalServerErrorException('Error');
    });

    expect(sut.uploadDocument(file, uploadData, params)).rejects.toThrow(
      new InternalServerErrorException('Error'),
    );
  });
});
