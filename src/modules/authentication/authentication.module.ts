import { Module } from '@nestjs/common';
import { AuthenticationController } from './controllers/login.controller';
import { AuthenticationService } from './services/authentication.service';
import { EmployeeModule } from '../employee/employee.module';
import { SecurityModule } from '../security/security.module';
import { Utils } from './utils/authentication.utils';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [EmployeeModule, SecurityModule, LoggerModule],
  controllers: [AuthenticationController],
  providers: [
    {
      provide: 'Authentication',
      useClass: AuthenticationService,
    },
    Utils,
  ],
})
export class AuthenticationModule {}
