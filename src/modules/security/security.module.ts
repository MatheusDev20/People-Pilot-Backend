import { Module } from '@nestjs/common';
import { EncryptService } from './services/encrypt.service';
import { JwtServiceManager } from './services/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from 'src/config/security/jwt.config.service';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
    LoggerModule,
  ],
  providers: [
    {
      provide: 'HashingService',
      useClass: EncryptService,
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
