import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from '../departments/department.entity';
import { DepartmentsService } from '../departments/department.service';
import { EmployeeController } from './employee.controller';
import { Employee } from './employee.entity';
import { EmployeeService } from './employee.service';
import { EmployeeRepository } from './repositories/employee.repository';
import { SecurityModule } from '../security/security.module';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Department]), SecurityModule],
  controllers: [EmployeeController],
  providers: [EmployeeService, DepartmentsService, EmployeeRepository],
})
export class EmployeeModule {}
