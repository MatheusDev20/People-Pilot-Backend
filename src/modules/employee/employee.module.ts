import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from '../departments/department.entity';
import { EmployeeController } from './employee.controller';
import { Employee } from './employee.entity';
import { EmployeeService } from './employee.service';
import { EmployeeRepository } from './repositories/employee.repository';
import { SecurityModule } from '../security/security.module';
import { DepartmentsModule } from '../departments/departments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, Department]),
    SecurityModule,
    DepartmentsModule,
  ],
  controllers: [EmployeeController],
  providers: [EmployeeService, EmployeeRepository],
})
export class EmployeeModule {}
