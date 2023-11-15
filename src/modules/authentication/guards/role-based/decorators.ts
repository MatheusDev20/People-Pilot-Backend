import { SetMetadata } from '@nestjs/common';

type StrategyType = 'all' | 'any';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
export const Strategy = (strategy: StrategyType) =>
  SetMetadata('strategy', strategy);
