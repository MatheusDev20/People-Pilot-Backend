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

  const ctxFactory = () => ({
    ip: 'fake-ip',
    cookies: { acess_token: 'valid_token' },
    headers: {},
  });
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

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should be defined', () => {
    expect(guard).toBeDefined();
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

    const cxtOpts = ctxFactory();
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
    const ctx = makeGenericContext(ctxFactory());
    await guard.canActivate(ctx);
    expect(matchAnySpy).toHaveBeenCalled();
  });

  it('Should call the correct method (matchAll) when the strategy is all', async () => {
    mockReflector.get.mockImplementationOnce(() => ['admin', 'manager', 'simple-user']);
    const strategySpy = jest.spyOn(guard, 'getStrategy');
    strategySpy.mockImplementationOnce(() => 'all');
    const matchAllSpy = jest.spyOn(guard, 'matchAll');
    const ctx = makeGenericContext(ctxFactory());
    await guard.canActivate(ctx);
    expect.assertions(1);
    expect(matchAllSpy).toHaveBeenCalled();
  });

  it('Should return false when the strategy is any and user role does not match any of the required roles', async () => {
    const strategySpy = jest.spyOn(guard, 'getStrategy');
    const guardSpy = jest.spyOn(guard, 'canActivate');
    mockReflector.get.mockImplementationOnce(() => ['admin', 'manager']);
    const spy = jest.spyOn(mockEmployeePermissionService, 'getEmployeeRoles');
    spy.mockImplementationOnce(() => {
      return new Promise((resolve) => resolve({ roles: ['simple-user'] }));
    });
    strategySpy.mockReturnValueOnce('any');
    const anySpy = jest.spyOn(guard, 'matchAny');

    const ctx = makeGenericContext(ctxFactory());
    const veredict = await guard.canActivate(ctx);
    expect(anySpy).toHaveBeenCalledWith(['admin', 'manager'], ['simple-user']);
    expect(veredict).toEqual(false);
    expect(guardSpy).toHaveBeenCalledTimes(1);
  });

  it('Should return true when the strategy is any and user role does match any of the required roles', async () => {
    const strategySpy = jest.spyOn(guard, 'getStrategy');
    const guardSpy = jest.spyOn(guard, 'canActivate');
    mockReflector.get.mockImplementationOnce(() => ['admin', 'manager']);
    const spy = jest.spyOn(mockEmployeePermissionService, 'getEmployeeRoles');
    spy.mockImplementationOnce(() => {
      return new Promise((resolve) => resolve({ roles: ['manager', 'simple-user'] }));
    });
    strategySpy.mockReturnValueOnce('any');
    const anySpy = jest.spyOn(guard, 'matchAny');

    const ctx = makeGenericContext(ctxFactory());
    const veredict = await guard.canActivate(ctx);
    expect(anySpy).toHaveBeenCalledWith(['admin', 'manager'], ['manager', 'simple-user']);
    expect(veredict).toEqual(true);
    expect(guardSpy).toHaveBeenCalledTimes(1);
  });

  it('Should return false when the strategy is all and user roles does not match all', async () => {
    const strategySpy = jest.spyOn(guard, 'getStrategy');
    const guardSpy = jest.spyOn(guard, 'canActivate');
    mockReflector.get.mockImplementationOnce(() => ['admin', 'manager']);
    const spy = jest.spyOn(mockEmployeePermissionService, 'getEmployeeRoles');
    spy.mockImplementationOnce(() => {
      return new Promise((resolve) => resolve({ roles: ['simple-user'] }));
    });
    strategySpy.mockReturnValueOnce('all');
    const allSpy = jest.spyOn(guard, 'matchAll');

    const ctx = makeGenericContext(ctxFactory());
    const veredict = await guard.canActivate(ctx);
    expect(allSpy).toHaveBeenCalledWith(['admin', 'manager'], ['simple-user']);
    expect(veredict).toEqual(false);
    expect(guardSpy).toHaveBeenCalledTimes(1);
  });

  it('Should return true when the strategy is all and user roles does match all', async () => {
    const strategySpy = jest.spyOn(guard, 'getStrategy');
    const guardSpy = jest.spyOn(guard, 'canActivate');
    mockReflector.get.mockImplementationOnce(() => ['admin', 'manager', 'simple-user']);
    const spy = jest.spyOn(mockEmployeePermissionService, 'getEmployeeRoles');
    spy.mockImplementationOnce(() => {
      return new Promise((resolve) => resolve({ roles: ['admin', 'manager', 'simple-user'] }));
    });
    strategySpy.mockReturnValueOnce('all');
    const allSpy = jest.spyOn(guard, 'matchAll');

    const ctx = makeGenericContext(ctxFactory());
    const veredict = await guard.canActivate(ctx);
    expect(allSpy).toHaveBeenCalledWith(
      ['admin', 'manager', 'simple-user'],
      ['admin', 'manager', 'simple-user'],
    );
    expect(veredict).toEqual(true);
    expect(guardSpy).toHaveBeenCalledTimes(1);
  });
});
