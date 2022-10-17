import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDTO } from './DTOs/CreateRoleDTO';
import { Role } from './role.entity';

@Injectable()
export class RoleService {
  constructor(@InjectRepository(Role) private repository: Repository<Role>) {}

  async findRole(roleId: number) {
    this.repository.findOneBy({ id: roleId });
  }

  async createRole(createRoleDTO: CreateRoleDTO): Promise<Role> {
    return this.repository.save(createRoleDTO);
  }
}
