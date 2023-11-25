import { RefreshTokenUseCase } from './../../../src/modules/authentication/use-cases/refresh-token-use-case';
import { Test, TestingModule } from '@nestjs/testing';

import { Response } from 'express';
import { Authentication } from 'src/@types';
import { LoginDTO } from 'src/modules/authentication/DTOs/login-controller.dto';
import { AuthenticationController } from 'src/modules/authentication/controllers/login.controller';
import { Utils } from 'src/modules/authentication/utils/authentication.utils';
import { JwtData } from 'src/modules/security/DTOs/jwt/jwt-dto';
import { makeFakeUser } from './mocks';
import { LoginUseCase } from 'src/modules/authentication/use-cases/login-use-case';

class AuthStub implements Authentication {
  login(): Promise<JwtData> {
    return new Promise((resolve) =>
      resolve({
        access_token: 'jwt_valid_token',
        expiration: '1h',
        user: makeFakeUser(),
        refreshToken: 'jwt_refresh_token',
      }),
    );
  }
  refresh(): Promise<JwtData> {
    return new Promise((resolve) =>
      resolve({
        access_token: 'jwt_valid_token',
        expiration: '1h',
        user: makeFakeUser(),
        refreshToken: 'jwt_new_refresh_token',
      }),
    );
  }
}
class LoginUseCaseStub {
  async execute() {
    return new Promise((resolve) =>
      resolve({
        access_token: 'jwt_valid_token',
        refreshToken: 'jwt_refresh_token',
        user: makeFakeUser(),
      }),
    );
  }
}
class RefreshTokenUseCaseStub {
  async execute() {
    return new Promise((resolve) => resolve('OK'));
  }
}

let controller: AuthenticationController;
let useCase: LoginUseCase;

describe('Login Controller', () => {
  const makeAuthentication = (): Authentication => {
    return new AuthStub();
  };

  const mockUtils = {
    setCookies(): Promise<string> {
      return new Promise((resolve) => resolve('Set cookies'));
    },
  };

  const makeAuthRequest = (): LoginDTO => ({
    email: 'fake@mail.com',
    password: 'fakePassword',
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        {
          provide: LoginUseCase,
          useClass: LoginUseCaseStub,
        },
        {
          provide: Utils,
          useValue: mockUtils,
        },
        {
          provide: RefreshTokenUseCase,
          useClass: RefreshTokenUseCaseStub,
        },
        {
          provide: 'Authentication',
          useFactory: makeAuthentication,
        },
      ],
    }).compile();
    controller = module.get<AuthenticationController>(AuthenticationController);
    useCase = module.get<LoginUseCase>(LoginUseCase);
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should call signIn method with the right arguments', async () => {
    const loginData = makeAuthRequest();
    const res: Partial<Response> = {};
    const spy = jest.spyOn(controller, 'signIn');

    await controller.signIn(res as Response, loginData);
    expect.assertions(1);
    expect(spy).toHaveBeenCalledWith(res, loginData);
  });

  it('Should call login use case method with the right methods', async () => {
    const loginData = makeAuthRequest();
    const res: Partial<Response> = {};
    const spy = jest.spyOn(useCase, 'execute');

    await controller.signIn(res as Response, loginData);
    expect.assertions(1);
    expect(spy).toHaveBeenCalledWith(loginData);
  });

  it('Should set cookies', async () => {
    const loginData = makeAuthRequest();
    const res: Partial<Response> = {};
    const spy = jest.spyOn(mockUtils, 'setCookies');

    await controller.signIn(res as Response, loginData);
    expect.assertions(1);
    expect(spy).toHaveBeenCalledWith(res, {
      access_token: 'jwt_valid_token',
      refreshToken: 'jwt_refresh_token',
    });
  });
});
