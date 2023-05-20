import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';
import { StorageManager } from 'src/@types';

export default class S3Service implements StorageManager {
  private _client: S3Client;
  private _s3Config: S3ClientConfig = {
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  };

  constructor() {
    this._client = new S3Client(this._s3Config);
  }

  persist(file: string): Promise<string> {
    return new Promise((resolve) => resolve(`Persist ${file} on S3 Instance`));
  }
}
