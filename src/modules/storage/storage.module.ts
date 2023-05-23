import { Module } from '@nestjs/common';
import { S3Service } from '../aws';
import { UploadFileService } from './upload/upload-file';
import AwsModule from '../aws/aws.module';

@Module({
  imports: [AwsModule],
  providers: [
    UploadFileService,
    {
      provide: 'StorageManager',
      useClass: S3Service,
    },
  ],

  exports: ['StorageManager', UploadFileService],
})
export class StorageModule {}
