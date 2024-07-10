import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organizations.entity';
import { OrganizationController } from './controllers/organization.controller';
import { AddOrganization } from './use-cases/add-organization';
import { SecurityModule } from '../security/security.module';
import { LoggerModule } from '../logger/logger.module';
// import { EmployeeModule } from '../employee/employee.module';
import { StorageModule } from '../storage/storage.module';
import { OrganizationsRepository } from './repositories';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization]),
    SecurityModule,
    LoggerModule,
    StorageModule,
  ],
  providers: [AddOrganization, OrganizationsRepository],
  controllers: [OrganizationController],
  exports: [OrganizationsRepository],
})
export class OrganizationsModule {}
