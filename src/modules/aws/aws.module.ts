import { Module } from '@nestjs/common';
import { S3Service } from '.';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [LoggerModule],
  providers: [S3Service],
  exports: [S3Service],
})
export default class AwsModule {}
