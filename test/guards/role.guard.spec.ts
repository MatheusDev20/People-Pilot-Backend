import { Test, TestingModule } from '@nestjs/testing';
import { RoleGuard } from 'src/modules/authentication/guards/role-based/role.guard';
import { makeGenericContext } from './mocks';
import { EmployeePermissionService } from 'src/modules/employee/services/employee-permissions.service';
import { Reflector } from '@nestjs/core';
import { UserRoles } from 'src/modules/authentication/DTOs/user-roles';
import { Request } from 'express';

describe('Role Guard', () => {
  const mockEmployeePermissionService = {
    async getEmployeeRoles(id: string): Promise<UserRoles> {
      return new Promise((resolve) => resolve({ roles: ['admin', 'manager'] }));
    },
  };
  const mockReflector = {
    get: jest.fn(),
  };
  let guard: RoleGuard;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleGuard,
        { provide: Reflector, useValue: mockReflector },
        { provide: EmployeePermissionService, useValue: mockEmployeePermissionService },
      ],
    }).compile();

    guard = module.get<RoleGuard>(RoleGuard);
  });

  it('Should pass (return true) if required roles is null', async () => {
    const cxtOpts = { ip: 'fake-ip', cookies: {}, headers: {} };
    const spy = jest.spyOn(mockReflector, 'get');
    spy.mockReturnValue(null);
    const ctx = makeGenericContext(cxtOpts);
    expect(guard.canActivate(ctx)).resolves.toEqual(true);
  });

  it('Should call the getEmployeeRoles with the right user id', async () => {
    mockReflector.get.mockImplementationOnce(() => ['admin', 'manager', 'simple-user']);
    const spy = jest.spyOn(guard, 'getUserRoles');

    const cxtOpts = { ip: 'fake-ip', cookies: {}, headers: {} };
    const ctx = makeGenericContext(cxtOpts);

    const request: Request = ctx.switchToHttp().getRequest();
    await guard.canActivate(ctx);

    expect.assertions(1);
    expect(spy).toHaveBeenCalledWith(request['user'].id);
  });

  it('Should call the correct method (matchAny) when the strategy is any', async () => {
    mockReflector.get.mockImplementationOnce(() => ['admin', 'manager', 'simple-user']);
    const strategySpy = jest.spyOn(guard, 'getStrategy');
    strategySpy.mockImplementationOnce(() => 'any');
    const matchAnySpy = jest.spyOn(guard, 'matchAny');
    const cxtOpts = { ip: 'fake-ip', cookies: {}, headers: {} };
    const ctx = makeGenericContext(cxtOpts);
    await guard.canActivate(ctx);
    expect(matchAnySpy).toHaveBeenCalled();
  });

  it('Should call the correct method (matchAll) when the strategy is all', async () => {
    mockReflector.get.mockImplementationOnce(() => ['admin', 'manager', 'simple-user']);
    const strategySpy = jest.spyOn(guard, 'getStrategy');
    strategySpy.mockImplementationOnce(() => 'all');
    const matchAllSpy = jest.spyOn(guard, 'matchAll');
    const cxtOpts = { ip: 'fake-ip', cookies: {}, headers: {} };
    const ctx = makeGenericContext(cxtOpts);
    await guard.canActivate(ctx);
    expect(matchAllSpy).toHaveBeenCalled();
  });
});
