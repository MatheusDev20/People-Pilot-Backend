import { HttpExceptionFilter } from './helpers/http/http-exceptions.filter';
import { Inject, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { EmployeeModule } from './modules/employee/employee.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { MySQLDBConfigService } from './config/MysqlConfig.service';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: MySQLDBConfigService,
      inject: [MySQLDBConfigService],
    }),
    EmployeeModule,
    DepartmentsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
