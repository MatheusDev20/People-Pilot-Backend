import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtManager } from 'src/modules/security/interfaces/jwt';
import { CustomLogger } from 'src/modules/logger/services/logger.service';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(
    @Inject('JwtManager') private jwtManager: JwtManager,
    private logger: CustomLogger,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    if (this.areCookiesExpired(request.cookies)) {
      this.logger.expiredCookie(request.ip, request['headers']['user-agent']);
      throw new UnauthorizedException('EXPIRED BOTH TOKENS');
    }

    const { accessToken, refreshToken } = this.exctractFromCookies(request);

    // Access Token expirou
    if (!accessToken && refreshToken) {
      throw new UnauthorizedException('EXPIRED ACCESS TOKEN');
    }

    /* JWT Signature Verifycation */
    try {
      const payload = await this.jwtManager.verifyToken(accessToken, {
        refresh: false,
      });
      request['user'] = payload;
      this.logger.sucessFullLogin(payload.id);
    } catch (err) {
      this.logger.failedAttempt(
        err.message,
        request.ip,
        request['headers']['user-agent'],
      );

      throw new UnauthorizedException('Token Signature Verification Failed');
    }

    return true;
  }

  exctractFromCookies(
    request: Request,
  ): { accessToken: string; refreshToken: string } | null {
    return {
      accessToken: request.cookies.access_token,
      refreshToken: request.cookies.refreshToken,
    };
  }

  areCookiesExpired = (cookies: any) => {
    return Object.keys(cookies).length === 0;
  };
}
