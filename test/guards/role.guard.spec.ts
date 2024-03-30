import { Test, TestingModule } from '@nestjs/testing';
import { RoleGuard } from 'src/modules/authentication/guards/role-based/role.guard';
import { makeGenericContext } from './mocks';
import { Reflector } from '@nestjs/core';
import { EmployeeRepository } from 'src/modules/employee/repositories/employee.repository';
import { makeFakeEmployee } from 'test/modules/employee/mocks';

describe('Role Guard', () => {
  const mockReflector = {
    get: jest.fn(),
  };

  let guard: RoleGuard;
  class EmployeeRepositoryStub {
    async find() {
      return new Promise((resolve) => resolve(makeFakeEmployee()));
    }
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EmployeeRepositoryStub],
      providers: [
        RoleGuard,
        { provide: Reflector, useValue: mockReflector },
        { provide: EmployeeRepository, useClass: EmployeeRepositoryStub },
      ],
    }).compile();

    guard = module.get<RoleGuard>(RoleGuard);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('Should pass (return true) if required roles is null ( Permissive Route ) ', async () => {
    const cxtOpts = { ip: 'fake-ip', cookies: {}, headers: {} };
    const spy = jest.spyOn(mockReflector, 'get');
    spy.mockReturnValue(null);
    const ctx = makeGenericContext(cxtOpts);
    expect(guard.canActivate(ctx)).resolves.toEqual(true);
  });
});
