import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Authentication } from 'src/@types';
import { JwtData } from 'src/modules/security/DTOs/jwt/jwt-dto';
import { JwtManager } from 'src/modules/security/interfaces/jwt';
import { makeFakeUser } from './mocks';
import { JwtPayload } from 'src/modules/security/DTOs/jwt/jwt-payload';
import { JwtConfigService } from 'src/config/security/jwt.config.service';
import { AuthenticationService } from 'src/modules/authentication/services/authentication.service';
import { LoginDTO } from 'src/modules/authentication/DTOs/login-controller.dto';
import { Employee } from 'src/modules/employee/entities/employee.entity';
import { EmployeeService } from 'src/modules/employee/services/employee.service';
import { CustomLogger } from 'src/modules/logger/services/logger.service';
import { Hashing } from 'src/modules/security/interfaces/hashing';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InvalidCredentials, NotFoundEmail } from 'src/errors/messages';

const jwtMockData = {
  access_token: 'any_token',
  expiration: '1h',
  user: makeFakeUser(),
  refreshToken: 'any_refresh_token',
};
const jwtMockPayload = { id: 'claim_user_id' };

describe('Authentication Service', () => {
  let service: Authentication;
  let employeeService: EmployeeServiceStub;
  let hashService: Hashing;
  let jwtManager: JwtManager;

  class EmployeeServiceStub {
    async find(): Promise<Employee> {
      return new Promise((resolve) => resolve(makeFakeUser()));
    }
    async storeRefreshToken(): Promise<void> {}
  }
  class HashingStub implements Hashing {
    hash(): Promise<string> {
      return new Promise((resolve) => resolve('hashing_plain_text'));
    }
    compare(): Promise<boolean> {
      return new Promise((resolve) => resolve(true));
    }
  }
  const makeFakeLoginRequest = (): LoginDTO => {
    return { email: 'fakemail@mail.com', password: 'fake-login-trial' };
  };
  class JwtManagerStub implements JwtManager {
    async generate(): Promise<JwtData> {
      return new Promise((resolve) => resolve(jwtMockData));
    }
    async verifyToken(): Promise<JwtPayload> {
      return new Promise((resolve) => resolve(jwtMockPayload));
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ isGlobal: true })],
      providers: [
        CustomLogger,
        { provide: 'JWTConfigService', useClass: JwtConfigService },
        {
          provide: 'JwtManager',
          useClass: JwtManagerStub,
        },
        {
          provide: 'HashingService',
          useClass: HashingStub,
        },
        {
          provide: 'Authentication',
          useClass: AuthenticationService,
        },
        {
          provide: EmployeeService,
          useClass: EmployeeServiceStub,
        },
      ],
    }).compile();
    service = module.get('Authentication');
    employeeService = module.get(EmployeeService);
    hashService = module.get('HashingService');
    jwtManager = module.get('JwtManager');
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should call service login method with the right arguments', async () => {
    const fakeLogin = makeFakeLoginRequest();
    const spy = jest.spyOn(service, 'login');
    await service.login(fakeLogin);

    expect(spy).toHaveBeenCalledWith(fakeLogin);
  });

  it('Should call find employee method with the correct email', async () => {
    const fakeLogin = makeFakeLoginRequest();
    const spy = jest.spyOn(employeeService, 'find');

    await service.login(fakeLogin);

    expect.assertions(1);
    expect(spy).toHaveBeenCalledWith('email', fakeLogin.email);
  });

  it('Should throw if not find an employee to log in', async () => {
    const fakeLogin = makeFakeLoginRequest();
    const spy = jest.spyOn(employeeService, 'find');
    expect.assertions(1);
    spy.mockImplementationOnce(() => new Promise((resolve) => resolve(null)));
    expect(service.login(fakeLogin)).rejects.toThrow(new NotFoundException(NotFoundEmail));
  });

  it('Should call hash compare method with the right arguments', async () => {
    const hashSpy = jest.spyOn(hashService, 'compare');
    const fakeLogin = makeFakeLoginRequest();

    await service.login(fakeLogin);
    expect.assertions(2);
    expect(hashSpy).toHaveBeenCalledWith(fakeLogin.password, makeFakeUser().password);
    expect(hashSpy).toHaveBeenCalledTimes(1);
  });

  it('Should call generate jwt method if hash compare succeed', async () => {
    const jwtSpy = jest.spyOn(jwtManager, 'generate');
    const { name, id } = makeFakeUser();
    const fakeLogin = makeFakeLoginRequest();
    await service.login(fakeLogin);

    expect(jwtSpy).toHaveBeenCalled();
    expect(jwtSpy).toHaveBeenCalledWith({ username: name, sub: String(id) });
  });

  it('Should Throw Unathorized Expection if compare fails', async () => {
    const hashSpy = jest.spyOn(hashService, 'compare');
    const fakeLogin = makeFakeLoginRequest();
    hashSpy.mockImplementationOnce(() => new Promise((resolve) => resolve(false)));
    expect(service.login(fakeLogin)).rejects.toThrow(new UnauthorizedException(InvalidCredentials));
  });

  it('Should return the jwt and the logged user if the comparison succeed', async () => {
    const jwtSpy = jest.spyOn(jwtManager, 'generate');
    const { name, id } = makeFakeUser();
    jwtSpy.mockImplementationOnce(
      (): Promise<Omit<JwtData, 'user'>> =>
        new Promise((resolve) =>
          resolve({
            access_token: 'valid_token',
            expiration: '1h',
            refreshToken: 'valid_refresh_token',
          }),
        ),
    );
    const fakeLogin = makeFakeLoginRequest();
    const loginData = await service.login(fakeLogin);
    expect(jwtSpy).toHaveBeenCalled();
    expect(jwtSpy).toHaveBeenCalledWith({ username: name, sub: String(id) });
    expect(loginData).toEqual({
      access_token: 'valid_token',
      expiration: '1h',
      user: loginData.user,
      refreshToken: 'valid_refresh_token',
    });
  });
});
