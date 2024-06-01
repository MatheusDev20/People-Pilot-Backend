import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class TenantIdentifier implements NestMiddleware {
  use(req: Request, _: Response, next: NextFunction) {
    const organizationId = req.headers['x-organization-id'];
    if (!organizationId) {
      throw new BadRequestException(
        'Missing Header x-organization-id is required',
      );
    }
    console.log('Apply', req.headers);
    next();
  }
}
