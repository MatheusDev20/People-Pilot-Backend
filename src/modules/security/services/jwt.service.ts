import { Inject, Injectable } from '@nestjs/common';
import { JwtManager } from '../interfaces/jwt';
import { JwtService } from '@nestjs/jwt';
import { JwtData } from '../DTOs/jwt/jwt-dto';
import { JwtPayload } from '../DTOs/jwt/jwt-payload';
import { JwtConfigService } from 'src/config/security/jwt.config.service';

@Injectable()
export class JwtServiceManager implements JwtManager {
  constructor(
    private jwtService: JwtService,
    @Inject('JWTConfigService') private jwtConfig: JwtConfigService,
  ) {}

  async generate(payload: JwtPayload): Promise<JwtData> {
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
}
