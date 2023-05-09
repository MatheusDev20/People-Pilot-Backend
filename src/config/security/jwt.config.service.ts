import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface JWTOptions {
  secret: string;
  expiration: string;
}

@Injectable()
export class JwtConfigService {
  constructor(private configService: ConfigService) {}

  getJwtOptions(): JWTOptions {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    const jwtExpiration = this.configService.get<string>('JWT_EXPIRATION');
    return { secret: jwtSecret, expiration: jwtExpiration };
  }
}
