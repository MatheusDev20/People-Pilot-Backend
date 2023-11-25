import { Module } from '@nestjs/common';
import { AuthenticationController } from './controllers/login.controller';
import { LoginUseCase } from './use-cases/login-use-case';
import { EmployeeModule } from '../employee/employee.module';
import { SecurityModule } from '../security/security.module';
import { Utils } from './utils/authentication.utils';
import { LoggerModule } from '../logger/logger.module';
import { RefreshTokenUseCase } from './use-cases/refresh-token-use-case';

@Module({
  imports: [EmployeeModule, SecurityModule, LoggerModule],
  controllers: [AuthenticationController],
  providers: [RefreshTokenUseCase, LoginUseCase, Utils],
})
export class AuthenticationModule {}
