import { FindOneOptions, Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { CreateTaskRepositoryDTO, UpdateTaskRepositoryDTO } from './DTO';
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

  async findBy(options: FindOneOptions<Task>, pushRelations = ''): Promise<Task> {
    if (pushRelations)
      options = { ...options, ...{ relations: { assignee: true, created_by: true } } };

    return this.repository.findOne(options);
  }

  async create(data: CreateTaskRepositoryDTO): Promise<UpdatedTask> {
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

  async update(id: string, updatedData: Partial<UpdateTaskRepositoryDTO>): Promise<UpdatedTask> {
    try {
      if (!(await this.findBy({ where: { id } }))) {
        throw new Error('Not found task on DB');
      }
      await this.repository
        .createQueryBuilder('task')
        .update(Task)
        .set({ ...updatedData })
        .where('id = :id', { id })
        .execute();

      return { id };
    } catch (err) {
      this.logger.error(`Transaction failed \n Error message: ${err}`);
    }
  }
}
