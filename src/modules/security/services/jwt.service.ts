import { Inject, Injectable } from '@nestjs/common';
import { JwtManager, VerifyOptions } from '../interfaces/jwt';
import { JwtService } from '@nestjs/jwt';
import { JwtData } from '../DTOs/jwt/jwt-dto';
import { CreateJwtData, JwtPayload } from '../DTOs/jwt/jwt-payload';
import { JwtConfigService } from 'src/config/security/jwt.config.service';

@Injectable()
export class JwtServiceManager implements JwtManager {
  constructor(
    private jwtService: JwtService,

    @Inject('JWTConfigService') private jwtConfig: JwtConfigService,
  ) {}

  async generate(payload: CreateJwtData): Promise<Omit<JwtData, 'user'>> {
    const jwtOptions = this.jwtConfig.getJwtOptions();
    const access_token = await this.jwtService.signAsync(payload, {
      secret: jwtOptions.secret,
      expiresIn: jwtOptions.expiration,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: jwtOptions.refreshTokenSecret,
      expiresIn: jwtOptions.refreshTokenExpiration,
    });

    return {
      access_token,
      refreshToken,
      expiration: jwtOptions.expiration,
    };
  }

  async verifyToken(token: string, options?: VerifyOptions): Promise<JwtPayload> {
    const { refresh } = options;
    const jwtOptions = this.jwtConfig.getJwtOptions();
    const payload = await this.jwtService.verifyAsync(token, {
      secret: refresh ? jwtOptions.refreshTokenSecret : jwtOptions.secret,
    });

    return { id: payload.sub };
  }
}
