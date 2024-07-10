import { HttpExceptionFilter } from './helpers/http/http-exceptions.filter';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { EmployeeModule } from './modules/employee/employee.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { MySQLDBConfigService } from './config/db/MysqlConfig.service';
import { APP_FILTER } from '@nestjs/core';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { TaskModule } from './modules/task/task.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { TenantIdentifier } from './middlewares';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: MySQLDBConfigService,
      inject: [MySQLDBConfigService],
    }),
    EmployeeModule,
    DepartmentsModule,
    TaskModule,
    AuthenticationModule,
    OrganizationsModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantIdentifier)
      .exclude(
        'auth/(.*)',
        {
          path: 'organization',
          method: RequestMethod.POST,
        },
        {
          path: 'employee/me',
          method: RequestMethod.GET,
        },
      )
      .forRoutes('*');
  }
}
