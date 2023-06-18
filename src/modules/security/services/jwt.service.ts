import { Inject, Injectable } from '@nestjs/common';
import { JwtManager } from '../interfaces/jwt';
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

    return {
      access_token,
      expiration: jwtOptions.expiration,
    };
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    const jwtOptions = this.jwtConfig.getJwtOptions();
    const payload = await this.jwtService.verifyAsync(token, {
      secret: jwtOptions.secret,
    });
    return { id: payload.sub };
  }
}
