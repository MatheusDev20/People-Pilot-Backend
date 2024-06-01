import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTaskDTO } from '../DTO';
import { TaskRepository } from '../repositories/task.repository';
import { CreateTaskRepositoryDTO } from '../repositories/DTO';
import { UpdatedTask } from '../DTO/responses.dto';
import { EmployeeRepository } from 'src/modules/employee/repositories/employee.repository';

@Injectable()
export class CreateTaskUseCase {
  constructor(
    private repository: TaskRepository,
    private employeeRepository: EmployeeRepository,
  ) {}

  async execute(data: CreateTaskDTO): Promise<UpdatedTask> {
    const { assignee_email, createdBy } = data;
    const assignee = await this.employeeRepository.find({
      where: { email: assignee_email },
    });

    const creator = await this.employeeRepository.find({
      where: { id: createdBy },
    });

    if (!assignee)
      throw new BadRequestException(`Assignee ${assignee_email} not found`);

    const newTaskData: CreateTaskRepositoryDTO = {
      ...data,
      assignee,
      created_by: creator,
    };

    return await this.repository.create(newTaskData);
  }
}
