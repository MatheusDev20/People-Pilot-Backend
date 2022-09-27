import { Module } from '@nestjs/common';
import { DepartmentsController } from './departments.controller';

@Module({
  controllers: [DepartmentsController],
})
export class DepartmentsModule {}
