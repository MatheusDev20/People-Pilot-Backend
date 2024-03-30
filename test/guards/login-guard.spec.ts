import { JwtData } from './../../src/modules/security/DTOs/jwt/jwt-dto';
import { JwtPayload } from './../../src/modules/security/DTOs/jwt/jwt-payload';
import { JwtManager } from './../../src/modules/security/interfaces/jwt';
import { SecurityModule } from './../../src/modules/security/security.module';
import { Test, TestingModule } from '@nestjs/testing';
import { LoginGuard } from './../../src/modules/authentication/guards/login/login.guard';
import { ConfigModule } from '@nestjs/config';
import { JwtConfigService } from 'src/config/security/jwt.config.service';
import { LoggerModule } from 'src/modules/logger/logger.module';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { makeFakeUser } from 'test/modules/authentication/mocks';
import { CustomLogger } from 'src/modules/logger/services/logger.service';

const jwtMockData = {
  access_token: 'any_token',
  expiration: '1h',
  user: makeFakeUser(),
  refreshToken: 'any_refresh_token',
};
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
  async generate(): Promise<JwtData> {
    return new Promise((resolve) => resolve(jwtMockData));
  }
  async verifyToken(): Promise<JwtPayload> {
    return new Promise((resolve) => resolve(jwtMockPayload));
  }
}

// class LoggerStub {
//   expiredCookie(ip: any, userAgent: any) {
//     console.log('calling Stub');
//     return 'Expired Cookies error log';
//   }
//   failedAttempt(errMsg: any, ipAddress: any, userAgent: string) {
//     console.log('Failed loggin attempt log');
//   }
// }
describe('Login Guard', () => {
  let guard: LoginGuard;
  let jwtManager: JwtManager;
  // let logger: CustomLogger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        LoggerModule,
        SecurityModule,
        ConfigModule.forRoot({ isGlobal: true }),
      ],
      providers: [
        CustomLogger,
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
    const ctx = makeGenericContext({}, 'fake-ip', {
      'user-agent': 'fake-user-agent',
    });
    const request: Request = ctx.switchToHttp().getRequest();
    expect.assertions(3);
    await expect(guard.canActivate(ctx)).rejects.toThrow(UnauthorizedException);
    expect(expiredCheckSpy).toHaveBeenCalledWith(request.cookies);
    expect(expiredCheckSpy).toHaveReturnedWith(true);
  });

  it('Should throw an EXPIRED BOTH TOKENS unauthorized message when the token and refreshToken is not in the cookies object', async () => {
    // Empty Cookies
    const ctx = makeGenericContext({}, 'fake-ip', {
      'user-agent': 'fake-user-agent',
    });
    await expect(guard.canActivate(ctx)).rejects.toThrow(
      new UnauthorizedException('EXPIRED BOTH TOKENS'),
    );
  });

  it('Should throw and EXPIRED ACCESS TOKEN  when only accessToken is not present on the cookie payload', async () => {
    const ctx = makeGenericContext({ refreshToken: 'any_jwt' }, 'fake-ip', {
      'user-agent': 'fake-user-agent',
    });
    await expect(guard.canActivate(ctx)).rejects.toThrow(
      new UnauthorizedException('EXPIRED ACCESS TOKEN'),
    );
  });

  it('Should return the access_token and refreshToken when cookie is present', async () => {
    const extractFromCookiesSpy = jest.spyOn(guard, 'exctractFromCookies');
    const ctx = makeGenericContext(
      { access_token: 'any_jwt', refreshToken: 'any_jwt' },
      'fake-ip',
      {
        'user-agent': 'fake-user-agent',
      },
    );
    await guard.canActivate(ctx);
    expect(extractFromCookiesSpy).toHaveReturnedWith({
      accessToken: 'any_jwt',
      refreshToken: 'any_jwt',
    });
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
      expect(e).toBeInstanceOf(UnauthorizedException);
    }
  });
});
