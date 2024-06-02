import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction } from 'express';
import { OrganizationsRepository } from 'src/modules/organizations/repositories';

@Injectable()
export class TenantIdentifier implements NestMiddleware {
  constructor(private organizationRepository: OrganizationsRepository) {}
  async use(req: Request, _: Response, next: NextFunction) {
    const organizationId = req.headers['x-organization-id'];

    if (!organizationId) {
      throw new BadRequestException(
        'Missing Header x-organization-id is required',
      );
    }

    const organization =
      await this.organizationRepository.findById(organizationId);

    if (!organization) {
      throw new BadRequestException('Organization not found');
    }
    req['org'] = organization;
    next();
  }
}
