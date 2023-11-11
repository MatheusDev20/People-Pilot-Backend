import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
  S3ClientConfig,
} from '@aws-sdk/client-s3';
import { FileAppResources, StorageManager } from 'src/@types';
import { buildS3Path } from '../helpers';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CustomLogger } from 'src/modules/logger/services/logger.service';

@Injectable()
export class S3Service implements StorageManager {
  client: S3Client;
  private _s3Config: S3ClientConfig = {
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  };

  constructor(private customLogger: CustomLogger) {
    this.client = new S3Client(this._s3Config);
  }
  /**
   *
   * @param file
   * @param resource
   * @returns The s3 path to the recent uploaded file
   */
  async persist(file: Express.Multer.File, resource: FileAppResources): Promise<string> {
    const { originalname, buffer, mimetype } = file;
    const s3Path = buildS3Path(originalname, resource);
    const input: PutObjectCommandInput = {
      Bucket: 'stx-system',
      Key: s3Path,
      Body: buffer,
      ContentType: mimetype,
      ACL: 'public-read',
    };
    try {
      const command = new PutObjectCommand(input);
      await this.client.send(command);
      this.customLogger.log(`File ${originalname} Uploaded to ${process.env.BUCKET_NAME}`);
      return new Promise((resolve) => resolve(`${process.env.BUCKET_URL}${s3Path}`));
    } catch (err) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
