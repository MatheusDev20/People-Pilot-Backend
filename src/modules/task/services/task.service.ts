import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdatedTask } from '../DTO/responses.dto';
import { TaskRepository } from '../repositories/task.repository';
import { UpdateTaskDTO } from '../DTO/update-task.dto';
import { EmployeeService } from 'src/modules/employee/services/employee.service';
import { Task } from '../entities/task.entity';
import { FindOptionsWhere } from 'typeorm';
import { ValidColumn } from 'src/@types';
import { UpdateTaskRepositoryDTO } from '../repositories/DTO';
import { formatDateToDbType } from 'src/helpers';

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
    if (!task) throw new NotFoundException('Task not found');

    const updatedData = await this.checkPropertiyes(data);
    return await this.repository.update(id, updatedData);
  }

  async read(id: string): Promise<any> {
    if (!(await this.find('id', id))) throw new NotFoundException('Task not found');
    return await this.repository.findBy({ where: { id } }, 'pushRelations');
  }

  /**
   *
   * @param propertyes
   * @returns An object mutated to update only the required values of specifc keys
   */
  private checkPropertiyes = async (
    propertyes: Partial<UpdateTaskDTO>,
  ): Promise<Partial<UpdateTaskRepositoryDTO>> => {
    const entries = await Promise.all(
      Object.entries(propertyes).map(async ([key, value]) => {
        switch (key as keyof UpdateTaskDTO) {
          case 'assignee_email':
            const assignee = await this.employeeService.find('email', value as string);
            if (!assignee) throw new NotFoundException('Assignee destiny not found');
            return ['assignee', assignee];
          case 'due_date':
            return ['due_date', formatDateToDbType(value as string)];

          default:
            return [key, value];
        }
      }),
    );
    return Object.fromEntries(entries);
  };
}
