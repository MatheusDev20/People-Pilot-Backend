import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../entities/organizations.entity';

type CreateOrganization = {
  name: string;
  brand_image: string;
};

@Injectable()
export class OrganizationsRepository {
  constructor(
    @InjectRepository(Organization)
    private repository: Repository<Organization>,
  ) {}

  public async create(data: CreateOrganization): Promise<{ id: string }> {
    const organization = await this.repository.save(data);
    const { id } = organization;
    return { id };
  }

  public findById = async (id: string): Promise<Organization> => {
    return await this.repository.findOne({ where: { id } });
  };
}
