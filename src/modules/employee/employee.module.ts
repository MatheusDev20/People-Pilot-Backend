import { Utils } from './utils/employee.utils';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from '../departments/entities/department.entity';
import { EmployeeController } from './controllers/employee.controller';
import { Employee } from './entities/employee.entity';
import { EmployeeService } from './services/employee.service';
import { EmployeeRepository } from './repositories/employee.repository';
import { SecurityModule } from '../security/security.module';
import { DepartmentsModule } from '../departments/departments.module';
import { EmployeePermissionService } from './services/employee-permissions.service';
import { RolesRepository } from './repositories/roles.repository';
import { Role } from './entities/roles.entity';
import { Validations } from './validations/validations';
import { LoggerModule } from '../logger/logger.module';
import { CreateEmployeeService } from './services/create-employee.service';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, Department, Role]),
    SecurityModule,
    DepartmentsModule,
    LoggerModule,
    StorageModule,
  ],
  controllers: [EmployeeController],
  providers: [
    EmployeeService,
    CreateEmployeeService,
    EmployeePermissionService,
    EmployeeRepository,
    RolesRepository,
    Validations,
    Utils,
  ],
  exports: [EmployeeService, EmployeePermissionService, EmployeeRepository],
})
export class EmployeeModule {}
