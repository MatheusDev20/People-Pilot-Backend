import { Module } from '@nestjs/common';
import { BcryptService } from './services/bcrypt.service';
import { JwtServiceManager } from './services/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from 'src/config/security/jwt.config.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
  ],
  providers: [
    {
      provide: 'HashingService',
      useClass: BcryptService,
    },
    {
      provide: 'JwtManager',
      useClass: JwtServiceManager,
    },
    {
      provide: 'JWTConfigService',
      useClass: JwtConfigService,
    },
  ],
  exports: ['HashingService', 'JwtManager'],
})
export class SecurityModule {}