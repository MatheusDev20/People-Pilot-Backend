import { FileAppResources, StorageManager } from 'src/@types';
import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { CustomLogger } from 'src/modules/logger/services/logger.service';
import { join } from 'path';

@Injectable()
export class DiskService implements StorageManager {
  constructor(private customLogger: CustomLogger) {}
  /**
   *
   * @param file
   * @param resource
   * @returns The local upload path to the recent uploaded file
   */
  async persist(file: Express.Multer.File, resource: FileAppResources): Promise<string> {
    const filename = file.fieldname + '-' + Date.now() + file.originalname;

    const filePath = join(process.env.LOCAL_UPLOAD_FOLDER, `${resource}`, filename);

    await fs.writeFile(filePath, file.buffer);

    return filePath;
  }
}
