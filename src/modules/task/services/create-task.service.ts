import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTaskDTO } from '../DTO';
import { TaskRepository } from '../repositories/task.repository';
import { EmployeeService } from 'src/modules/employee/services/employee.service';
import { CreateTaskRepositoryDTO } from '../repositories/DTO';
import { UpdatedTask } from '../DTO/responses.dto';

@Injectable()
export class CreateTaskService {
  constructor(private repository: TaskRepository, private employeeService: EmployeeService) {}

  async execute(data: CreateTaskDTO): Promise<UpdatedTask> {
    const { assignee_email, createdBy } = data;
    const assignee = await this.employeeService.find('email', assignee_email);
    const creator = await this.employeeService.find('id', createdBy);

    if (!assignee) throw new BadRequestException(`Assignee ${assignee_email} not found`);

    const newTaskData: CreateTaskRepositoryDTO = {
      ...data,
      assignee,
      created_by: creator,
    };

    return await this.repository.create(newTaskData);
  }
}
