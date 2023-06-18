import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './entities/department.entity';
import { DepartmentsService } from './services/department.service';
import { DepartmentsController } from './controllers/departments.controller';
import { DepartmentRepository } from './repositories/department.repository';
import { SecurityModule } from '../security/security.module';
import { EmployeeModule } from '../employee/employee.module';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [
    forwardRef(() => EmployeeModule),
    TypeOrmModule.forFeature([Department]),
    SecurityModule,
    LoggerModule,
  ],
  controllers: [DepartmentsController],
  providers: [DepartmentsService, DepartmentRepository],
  exports: [DepartmentsService, DepartmentRepository], // I have to export this classes to use them in another module
})
export class DepartmentsModule {}
