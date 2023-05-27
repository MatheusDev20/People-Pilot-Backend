import { Test, TestingModule } from '@nestjs/testing';
import { Response, response } from 'express';
import { Authentication } from 'src/@types';
import { CookieData } from 'src/modules/authentication/DTOs/cookie-data.dto';
import { LoginDTO } from 'src/modules/authentication/DTOs/login-controller.dto';
import { AuthenticationController } from 'src/modules/authentication/controllers/login.controller';
import { Utils } from 'src/modules/authentication/utils/authentication.utils';
import { JwtData } from 'src/modules/security/DTOs/jwt/jwt-dto';

class AuthStub implements Authentication {
  signIn(data: LoginDTO): Promise<JwtData> {
    return new Promise((resolve) => resolve({ access_token: 'jwt_valid_token', expiration: '1h' }));
  }
}

let controller: AuthenticationController;

describe('Login Controller', () => {
  const makeAuthentication = (): Authentication => {
    return new AuthStub();
  };

  const mockUtils = {
    setCookies(currResponse: Response, cookieData: CookieData): Promise<string> {
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
          provide: 'Authentication',
          useValue: makeAuthentication(),
        },
        {
          provide: Utils,
          useValue: mockUtils,
        },
      ],
    }).compile();
    controller = module.get<AuthenticationController>(AuthenticationController);
  });

  it('Should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should call signIn method with the right arguments', async () => {
    const loginData = makeAuthRequest();
    const res: Partial<Response> = {};
    const spy = jest.spyOn(controller, 'signIn');

    await controller.signIn(res as Response, loginData);
    expect(spy).toHaveBeenCalledWith(res, loginData);
  });
});
