import { Inject, Injectable } from '@nestjs/common';
import { FileAppResources, StorageManager } from 'src/@types';

@Injectable()
export class UploadFileService {
  constructor(@Inject('StorageManager') private manager: StorageManager) {}

  async uploadSingleFile(file: Express.Multer.File, resource: FileAppResources): Promise<string> {
    return await this.manager.persist(file, resource);
  }
}
