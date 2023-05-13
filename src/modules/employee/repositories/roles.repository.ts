import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../entities/roles.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesRepository {
  constructor(@InjectRepository(Role) private repository: Repository<Role>) {}

  async findRole(roleName: string) {
    return this.repository.findOne({
      where: { name: roleName },
    });
  }
}
