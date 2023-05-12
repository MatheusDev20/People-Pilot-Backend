import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from '../departments/department.entity';
import { EmployeeController } from './controllers/employee.controller';
import { Employee } from './entities/employee.entity';
import { EmployeeService } from './services/employee.service';
import { EmployeeRepository } from './repositories/employee.repository';
import { SecurityModule } from '../security/security.module';
import { DepartmentsModule } from '../departments/departments.module';
import { EmployeePermissionService } from './services/employee-permissions.service';
import { RolesRepository } from './repositories/roles.repository';
import { Role } from './entities/roles.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, Department, Role]),
    SecurityModule,
    DepartmentsModule,
  ],
  controllers: [EmployeeController],
  providers: [
    EmployeeService,
    EmployeePermissionService,
    EmployeeRepository,
    RolesRepository,
  ],
  exports: [EmployeeService, EmployeePermissionService],
})
export class EmployeeModule {}
