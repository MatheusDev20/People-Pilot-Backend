import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './department.entity';
import { DepartmentsService } from './department.service';
import { DepartmentsController } from './departments.controller';
import { DepartmentRepository } from './repositories/department.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Department])],
  controllers: [DepartmentsController],
  providers: [DepartmentsService, DepartmentRepository],
  exports: [DepartmentsService, DepartmentRepository], // I have to export this classes to use them in another module
})
export class DepartmentsModule {}
