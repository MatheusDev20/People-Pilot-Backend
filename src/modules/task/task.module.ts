import { Module, forwardRef } from '@nestjs/common';
import { TaskController } from './controllers/task.controller';
import { Task } from './entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeModule } from '../employee/employee.module';
import { SecurityModule } from '../security/security.module';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    forwardRef(() => EmployeeModule),
    SecurityModule,
    LoggerModule,
  ],
  controllers: [TaskController],
})
export class TaskModule {}
