import { Module } from '@nestjs/common';
import { S3Service } from '../aws';
import { UploadFileService } from './upload/upload-file';

@Module({
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
