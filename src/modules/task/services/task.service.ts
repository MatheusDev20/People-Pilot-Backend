import { Injectable } from '@nestjs/common';
import { UpdatedTask } from '../DTO/responses.dto';
import { TaskRepository } from '../repositories/task.repository';

@Injectable()
export class TaskService {
  constructor(private repository: TaskRepository) {}
  async delete(taskId: string): Promise<UpdatedTask> {
    return await this.repository.delete(taskId);
  }
}
