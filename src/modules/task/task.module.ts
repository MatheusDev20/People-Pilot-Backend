import { Module, forwardRef } from '@nestjs/common';
import { TaskController } from './controllers/task.controller';
import { Task } from './entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeModule } from '../employee/employee.module';
import { SecurityModule } from '../security/security.module';
import { LoggerModule } from '../logger/logger.module';
import { CreateTaskUseCase } from './services/create-task-use-case';
import { TaskRepository } from './repositories/task.repository';
import { TaskService } from './services/task.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    forwardRef(() => EmployeeModule),
    SecurityModule,
    LoggerModule,
  ],
  providers: [CreateTaskUseCase, TaskRepository, TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
