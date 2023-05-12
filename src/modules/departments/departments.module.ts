import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './department.entity';
import { DepartmentsService } from './services/department.service';
import { DepartmentsController } from './controllers/departments.controller';
import { DepartmentRepository } from './repositories/department.repository';
import { SecurityModule } from '../security/security.module';
import { EmployeeModule } from '../employee/employee.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Department]),
    SecurityModule,
    forwardRef(() => EmployeeModule),
  ],
  controllers: [DepartmentsController],
  providers: [DepartmentsService, DepartmentRepository],
  exports: [DepartmentsService, DepartmentRepository], // I have to export this classes to use them in another module
})
export class DepartmentsModule {}
