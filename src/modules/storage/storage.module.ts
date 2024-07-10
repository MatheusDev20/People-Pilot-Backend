import { Module } from '@nestjs/common';
import { S3Service } from '../aws';
import { UploadFileService } from './upload-file';
import AwsModule from '../aws/aws.module';
import { LoggerModule } from '../logger/logger.module';
import { ConfigModule } from '@nestjs/config';
import { CustomLogger } from '../logger/services/logger.service';
@Module({
  imports: [AwsModule, LoggerModule, ConfigModule.forRoot()],
  providers: [
    UploadFileService,
    {
      provide: 'StorageManager',
      useFactory: (customLogger: CustomLogger) => {
        return new S3Service(customLogger);
      },
      inject: [CustomLogger],
    },
  ],

  exports: ['StorageManager', UploadFileService],
})
export class StorageModule {}
