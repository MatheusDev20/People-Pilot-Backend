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
import { LoggerModule } from '../logger/logger.module';
import { CreateEmployeeService } from './services/create-employee.service';
import { StorageModule } from '../storage/storage.module';
import { Task } from '../task/entities/task.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, Department, Role, Task]),
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
    Utils,
  ],
  exports: [EmployeeService, EmployeePermissionService, EmployeeRepository],
})
export class EmployeeModule {}
