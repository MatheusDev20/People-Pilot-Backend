import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { DepartmentsService } from './services/department.service';
import { DepartmentsController } from './controllers/departments.controller';
import { DepartmentRepository } from './repositories/department.repository';
import { SecurityModule } from '../security/security.module';
import { EmployeeModule } from '../employee/employee.module';
import { DepartmentValidations } from './validations/validations';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Department]),
    SecurityModule,
    forwardRef(() => EmployeeModule),
    LoggerModule,
  ],
  controllers: [DepartmentsController],
  providers: [DepartmentValidations, DepartmentsService, DepartmentRepository],
  exports: [DepartmentsService, DepartmentRepository], // I have to export this classes to use them in another module
})
export class DepartmentsModule {}
