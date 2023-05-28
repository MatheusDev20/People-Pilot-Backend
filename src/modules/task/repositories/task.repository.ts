import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { CreateTaskRepository } from './DTO';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CustomLogger } from 'src/modules/logger/services/logger.service';
import { UpdatedTask } from '../DTO/responses.dto';

@Injectable()
export class TaskRepository {
  constructor(
    @InjectRepository(Task) private repository: Repository<Task>,
    private logger: CustomLogger,
  ) {}

  async create(data: CreateTaskRepository): Promise<UpdatedTask> {
    try {
      const dbResponse = await this.repository.save(data);
      return { id: dbResponse.id };
    } catch (err) {
      this.logger.error(`Transaction failed \n Error message: ${err}`);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async delete(id: string): Promise<UpdatedTask> {
    try {
      await this.repository
        .createQueryBuilder('task')
        .delete()
        .from(Task)
        .where('id = :id', { id })
        .execute();

      return { id };
    } catch (err) {
      this.logger.error(`Transaction failed \n Error message: ${err}`);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
