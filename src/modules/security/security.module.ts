import { Module } from '@nestjs/common';
import { BcryptService } from './services/bcrypt.service';

@Module({
  providers: [
    {
      provide: 'HashingService',
      useClass: BcryptService,
    },
  ],
  exports: ['HashingService'],
})
export class SecurityModule {}
