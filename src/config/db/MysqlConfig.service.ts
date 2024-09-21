import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import path from 'path';

@Injectable()
export class MySQLDBConfigService implements TypeOrmOptionsFactory {
  private logger = new Logger();
  constructor(private configService: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    const entities = this.configService.get<string>('DB_ENTITIES');
    try {
      console.log('DB_NAME', this.configService.get<string>('DB_NAME'));
      console.log('DB_HOST', this.configService.get<string>('DB_HOST'));
      console.log('DB_USERNAME', this.configService.get<string>('DB_USERNAME'));

      console.log(path.join(__dirname, '..', '..') + entities);
      this.logger.log(
        'Trying to connect to the database',
        this.configService.get<string>('DB_NAME'),
      );
      const options: TypeOrmModuleOptions = {
        type: 'mysql',
        host: this.configService.get<string>('DB_HOST'),
        username: this.configService.get<string>('DB_USERNAME'),
        port: this.configService.get<number>('DB_PORT'),
        password: this.configService.get<string>('DB_PASSWORD'),
        database: this.configService.get<string>('DB_NAME'),
        entities: [path.join(__dirname, '..', '..') + entities],
        synchronize: this.configService.get<boolean>('DB_SYNC'),

        logging: ['warn', 'info', 'log'],
      };
      return options;
    } catch (err) {
      this.logger.error(
        `Unhandled exception in createTypeOrmOptions: ${err.message}`,
      );
    }
  }
}
