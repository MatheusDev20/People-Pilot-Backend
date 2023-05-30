import { JwtData } from './../../src/modules/security/DTOs/jwt/jwt-dto';
import { JwtPayload } from './../../src/modules/security/DTOs/jwt/jwt-payload';
import { JwtManager } from './../../src/modules/security/interfaces/jwt';
import { SecurityModule } from './../../src/modules/security/security.module';
import { Test, TestingModule } from '@nestjs/testing';
import { LoginGuard } from './../../src/modules/authentication/guards/login/login.guard';
import { ConfigModule } from '@nestjs/config';
import { JwtConfigService } from 'src/config/security/jwt.config.service';
import { LoggerModule } from 'src/modules/logger/logger.module';
import { CreateJwtData } from 'src/modules/security/DTOs/jwt/jwt-payload';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { makeFakeUser } from 'test/modules/authentication/mocks';

const jwtMockData = { access_token: 'any_token', expiration: '1h', user: makeFakeUser() };
const jwtMockPayload = { id: 'claim_user_id' };

const makeGenericContext = (cookies: object, ip: string, headers: object) => {
  return {
    switchToHttp: () => ({
      getRequest: () => ({
        cookies,
        ip,
        headers,
      }),
    }),
  } as ExecutionContext;
};
class JwtManagerStub implements JwtManager {
  async generate(payload: CreateJwtData): Promise<JwtData> {
    return new Promise((resolve) => resolve(jwtMockData));
  }
  async verifyToken(token: string): Promise<JwtPayload> {
    return new Promise((resolve) => resolve(jwtMockPayload));
  }
}
describe('Login Guard', () => {
  let guard: LoginGuard;
  let jwtManager: JwtManager;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [LoggerModule, SecurityModule, ConfigModule.forRoot({ isGlobal: true })],
      providers: [
        LoginGuard,
        { provide: 'JWTConfigService', useClass: JwtConfigService },
        {
          provide: 'JwtManager',
          useClass: JwtManagerStub,
        },
      ],
    }).compile();

    guard = module.get<LoginGuard>(LoginGuard);
    jwtManager = module.get<JwtManagerStub>('JwtManager');
  });

  it('Should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('Should return false and throws when cookie is expired', async () => {
    const expiredCheckSpy = jest.spyOn(guard, 'areCookiesExpired');
    const ctx = makeGenericContext({}, 'fake-ip', { 'user-agent': 'fake-user-agent' });
    const request: Request = ctx.switchToHttp().getRequest();
    expect.assertions(3);
    await expect(guard.canActivate(ctx)).rejects.toThrow(UnauthorizedException);
    expect(expiredCheckSpy).toHaveBeenCalledWith(request.cookies);
    expect(expiredCheckSpy).toHaveReturnedWith(true);
  });

  it('Should throw when the token is not in the cookies object', async () => {
    const extractFromCookiesSpy = jest.spyOn(guard, 'exctractFromCookies');
    const ctx = makeGenericContext({ random_key: 'random_value' }, 'fake-ip', {
      'user-agent': 'fake-user-agent',
    });
    const request: Request = ctx.switchToHttp().getRequest();
    await expect(guard.canActivate(ctx)).rejects.toThrow(UnauthorizedException);
    expect(extractFromCookiesSpy).toHaveBeenCalledWith(request);
    expect(extractFromCookiesSpy).toHaveReturnedWith(null);
  });

  it('Should return the access_token when cookie is present', async () => {
    const extractFromCookiesSpy = jest.spyOn(guard, 'exctractFromCookies');
    const ctx = makeGenericContext({ access_token: 'any_jwt' }, 'fake-ip', {
      'user-agent': 'fake-user-agent',
    });
    await guard.canActivate(ctx);
    expect(extractFromCookiesSpy).toHaveReturnedWith('any_jwt');
  });

  it('Should throw when the verify function throws', async () => {
    const verifySpy = jest.spyOn(jwtManager, 'verifyToken');
    const ctx = makeGenericContext({ access_token: 'invalid_jwt' }, 'fake-ip', {
      'user-agent': 'fake-user-agent',
    });
    verifySpy.mockRejectedValue(new Error());
    try {
      await guard.canActivate(ctx);
    } catch (e) {
      console.log(e);
      expect(e).toBeInstanceOf(UnauthorizedException);
    }
  });
});
