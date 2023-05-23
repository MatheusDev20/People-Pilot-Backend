import { Module } from '@nestjs/common';
import { S3Service } from '../aws';
import { UploadFileService } from './upload/upload-file';
import AwsModule from '../aws/aws.module';
import { LoggerModule } from '../logger/logger.module';
import { DiskService } from './disk/disk.service';

@Module({
  imports: [AwsModule, LoggerModule],
  providers: [
    UploadFileService,
    {
      provide: 'StorageManager',
      useClass: DiskService,
    },
  ],

  exports: ['StorageManager', UploadFileService],
})
export class StorageModule {}
