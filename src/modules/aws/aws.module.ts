import { Module } from '@nestjs/common';
import { S3Service } from '.';

@Module({
  providers: [S3Service],
  exports: ['S3Service'],
})
export default class AwsModule {}
