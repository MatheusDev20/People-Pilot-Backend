import { Module } from '@nestjs/common';
import S3Service from './services/s3.service';

@Module({
  providers: [
    {
      provide: 'S3Service',
      useClass: S3Service,
    },
  ],
  exports: ['S3Service'],
})
export default class AwsModule {}
