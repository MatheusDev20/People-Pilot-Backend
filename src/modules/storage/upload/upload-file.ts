import { Inject } from '@nestjs/common';
import { UploadService } from '../../storage/@types';
import { StorageManager } from 'src/@types';

export class UploadFileService implements UploadService {
  constructor(@Inject('StorageManager') private manager: StorageManager) {}

  async uploadAvatar(file: string): Promise<string> {
    return await this.manager.persist(file);
  }
}
