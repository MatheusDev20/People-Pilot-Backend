import { Injectable } from '@nestjs/common';
import { UploadFileService } from 'src/modules/storage/upload-file';
import { OrganizationsRepository } from '../repositories';

type Input = {
  name: string;
  file: Express.Multer.File;
};

@Injectable()
export class AddOrganization {
  constructor(
    private uploadFileService: UploadFileService,
    private repository: OrganizationsRepository,
  ) {}
  public async execute(data: Input) {
    const { file, name } = data;
    const brandUrl = await this.uploadFileService.uploadSingleFile(
      file,
      'organizations',
      name,
    );

    const { id } = await this.repository.create({
      name: data.name,
      brand_image: brandUrl,
    });

    return { id };
  }
}
