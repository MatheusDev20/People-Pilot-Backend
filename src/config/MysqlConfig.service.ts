import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';

@Injectable()
export class MySQLDBConfigService implements TypeOrmOptionsFactory {
  private logger = new Logger();
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    this.logger.log(
      `Connecting to the Database ${this.configService.get<string>('DB_NAME')}`,
    );
    return {
      type: 'mysql',
      host: this.configService.get<string>('DB_HOST'),
      username: this.configService.get<string>('DB_USERNAME'),
      port: this.configService.get<number>('DB_PORT'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_NAME'),
      entities: ['dist/modules/**/*.entity.js'],
      synchronize: this.configService.get<boolean>('DB_SYNC'),
    };
  }
}
