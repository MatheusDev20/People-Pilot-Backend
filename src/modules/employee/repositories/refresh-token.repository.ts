import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { RefreshTokens } from '../entities/refresh-token.entity';
import { CreateRefreshTokenDTO } from './DTOs/refresh-token.dto';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshTokens)
    private repository: Repository<RefreshTokens>,
  ) {}

  async save(data: CreateRefreshTokenDTO) {
    this.repository.save(data);
  }

  async find(options: FindOneOptions<RefreshTokens>, pushRelations = null): Promise<RefreshTokens> {
    if (pushRelations) options = { ...options, ...{ relations: pushRelations } };
    return await this.repository.findOne(options);
  }
}
