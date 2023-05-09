import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './services/authentication.service';
import { EmployeeModule } from '../employee/employee.module';
import { SecurityModule } from '../security/security.module';

@Module({
  imports: [EmployeeModule, SecurityModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
})
export class AuthenticationModule {}
