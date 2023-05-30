import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdatedTask } from '../DTO/responses.dto';
import { TaskRepository } from '../repositories/task.repository';
import { UpdateTaskDTO } from '../DTO/update-task.dto';
import { EmployeeService } from 'src/modules/employee/services/employee.service';
import { Task } from '../entities/task.entity';
import { FindOptionsWhere } from 'typeorm';
import { ValidColumn } from 'src/@types';

@Injectable()
export class TaskService {
  constructor(private repository: TaskRepository, private employeeService: EmployeeService) {}
  async find(property: ValidColumn<Task>, value: string): Promise<Task> {
    const options: FindOptionsWhere<Task> = { [property]: value };
    return await this.repository.findBy({ where: options });
  }

  async delete(taskId: string): Promise<UpdatedTask> {
    if (!(await this.find('id', taskId))) throw new NotFoundException('Task not found');
    return await this.repository.delete(taskId);
  }

  async update(id: string, data: Partial<UpdateTaskDTO>): Promise<UpdatedTask> {
    const task = await this.find('id', id);
    return { id: 'ok' };
  }
}
