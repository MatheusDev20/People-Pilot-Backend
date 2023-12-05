import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { DepartmentsService } from './services/department.service';
import { DepartmentsController } from './controllers/departments.controller';
import { DepartmentRepository } from './repositories/department.repository';
import { SecurityModule } from '../security/security.module';
import { EmployeeModule } from '../employee/employee.module';
import { LoggerModule } from '../logger/logger.module';
import { ListAllDepartmentsUseCase } from './use-cases/listAll-use-case';

@Module({
  imports: [
    forwardRef(() => EmployeeModule),
    TypeOrmModule.forFeature([Department]),
    SecurityModule,
    LoggerModule,
  ],
  controllers: [DepartmentsController],
  providers: [
    DepartmentsService,
    DepartmentRepository,
    ListAllDepartmentsUseCase,
  ],
  exports: [DepartmentsService, DepartmentRepository],
})
export class DepartmentsModule {}
