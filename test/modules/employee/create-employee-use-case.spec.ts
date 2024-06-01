import { Test } from '@nestjs/testing';
import { DepartmentsService } from 'src/modules/departments/services/department.service';
import { EmployeeRepository } from 'src/modules/employee/repositories/employee.repository';
import { CreateEmployeeUseCase } from 'src/modules/employee/use-cases/create-employee-use-case';

describe('Create Employee Use Case', () => {
  let sut: CreateEmployeeUseCase;
  let repository: EmployeeRepository;
  let departmentServiceSpy: DepartmentsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: DepartmentsService,
          useClass: DepartmentsServiceStub,
        },
        {
          provide: EmployeeRepository,
          useClass: EmployeeRepositoryStub,
        },
        {
          provide: RefreshTokenRepository,
          useClass: RefreshTokenRepositoryStub,
        },
        EmployeeService,
      ],
    }).compile();

    sut = module.get<EmployeeService>(EmployeeService);
    repository = module.get<EmployeeRepository>(EmployeeRepository);
    departmentServiceSpy = module.get<DepartmentsService>(DepartmentsService);
  });
});
