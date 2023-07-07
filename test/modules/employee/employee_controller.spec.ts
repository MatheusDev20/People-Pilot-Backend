import { EmployeeService } from './../../../src/modules/employee/services/employee.service';
import { CreateEmployeeService } from './../../../src/modules/employee/services/create-employee.service';
import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeController } from 'src/modules/employee/controllers/employee.controller';
import { makeFakeUser } from '../authentication/mocks';
import { Employee } from 'src/modules/employee/entities/employee.entity';
import { CreateEmployeeDTO } from 'src/modules/employee/DTOs/create-employee-dto';
import { SecurityModule } from 'src/modules/security/security.module';
import { LoggerModule } from 'src/modules/logger/logger.module';
import { ConfigModule } from '@nestjs/config';
import { EmployeePermissionService } from 'src/modules/employee/services/employee-permissions.service';
import { StorageModule } from 'src/modules/storage/storage.module';
import { makeFakeEmployee, makeFakeGetDepartmentRequest, makeFakeupdateEmployee } from './mocks';
import { v4 } from 'uuid';
import { FindOneDTO } from 'src/class-validator/find-one.dto';
import { UpdateEmployeeResponse } from 'src/modules/employee/DTOs/responses.dto';

describe('Employee Controller', () => {
  let sut: EmployeeController;
  let employeeService: EmployeeService;
  let createService: CreateEmployeeService;

  class ServiceStub {
    async getEmployeeByDepartment(): Promise<Employee[]> {
      return new Promise((resolve) => resolve([makeFakeUser(), makeFakeUser()]));
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
  class CreateServiceStub {
    async execute(data: CreateEmployeeDTO) {
      return new Promise((resolve) => resolve('OK'));
    }
  }

  class PermissionServiceStub {
    async getRoles() {
      return new Promise((resolve) => resolve('userRoles'));
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
          provide: CreateEmployeeService,
          useClass: CreateServiceStub,
        },
        {
          provide: EmployeeService,
          useClass: ServiceStub,
        },
        {
          provide: EmployeePermissionService,
          useClass: PermissionServiceStub,
        },
      ],
    }).compile();

    sut = module.get<EmployeeController>(EmployeeController);
    employeeService = module.get<EmployeeService>(EmployeeService);
    createService = module.get<CreateEmployeeService>(CreateEmployeeService);
  });

  it('Should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('Should call getByDepartment with the right arguments', async () => {
    const fakeData = makeFakeGetDepartmentRequest();
    const spy = jest.spyOn(sut, 'getByDepartament');
    const serviceSpy = jest.spyOn(employeeService, 'getEmployeeByDepartment');
    await sut.getByDepartament(fakeData);

    expect.assertions(3);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(fakeData);
    expect(serviceSpy).toHaveBeenCalled();
  });

  it('Should call save with the right arguments', async () => {
    const fakeData = makeFakeEmployee();
    const spy = jest.spyOn(sut, 'save');
    const serviceSpy = jest.spyOn(createService, 'execute');
    await sut.save(fakeData);

    expect.assertions(3);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(fakeData);
    expect(serviceSpy).toHaveBeenCalled();
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
});
