import { Module } from '@nestjs/common';
import { S3Service } from '../aws';
import { UploadFileService } from './upload/upload-file';
import AwsModule from '../aws/aws.module';
import { LoggerModule } from '../logger/logger.module';
import { DiskService } from './disk/disk.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CustomLogger } from '../logger/services/logger.service';
@Module({
  imports: [AwsModule, LoggerModule, ConfigModule.forRoot()],
  providers: [
    UploadFileService,
    {
      provide: 'StorageManager',
      useFactory: (
        configService: ConfigService,
        customLogger: CustomLogger,
      ) => {
        const env = configService.get<string>('NODE_ENV');
        // TODO: Must be a better style way to do that.
        if (env === 'development') {
          return new DiskService(customLogger);
        } else {
          return new S3Service(customLogger);
        }
      },
      inject: [ConfigService, CustomLogger],
    },
  ],

  exports: ['StorageManager', UploadFileService],
})
export class StorageModule {}
