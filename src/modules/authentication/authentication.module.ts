import { Module } from '@nestjs/common';
import { AuthenticationController } from './controllers/login.controller';
import { AuthenticationService } from './services/authentication.service';
import { EmployeeModule } from '../employee/employee.module';
import { SecurityModule } from '../security/security.module';
import { Utils } from './utils/authentication.utils';

@Module({
  imports: [EmployeeModule, SecurityModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, Utils],
})
export class AuthenticationModule {}
