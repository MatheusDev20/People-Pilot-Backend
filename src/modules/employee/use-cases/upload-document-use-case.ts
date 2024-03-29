import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UploadDocumentDTO } from '../DTOs';
import { UploadFileService } from 'src/modules/storage/upload/upload-file';
import { EmployeeRepository } from '../repositories/employee.repository';
import { EmployeeDocument } from 'src/@types';
import { DocumentsRepository } from '../repositories/documents.repository';
import { CustomLogger } from 'src/modules/logger/services/logger.service';

type Input = {
  id: string;
  data: UploadDocumentDTO;
  file: EmployeeDocument;
};

type Output = {
  docIdentifierId: string;
};

@Injectable()
export class UploadDocumentUseCase {
  constructor(
    private uploadService: UploadFileService,
    private employeeRepository: EmployeeRepository,
    private documentsRepository: DocumentsRepository,
    private Logger: CustomLogger,
  ) {}
  async execute({ id, data, file }: Input): Promise<Output> {
    try {
      const employee = await this.employeeRepository.find({ where: { id } });
      if (!employee) throw new NotFoundException('Employee not found');

      const fileUrl = await this.uploadService.uploadSingleFile(
        file,
        `employee_documents/${employee.name}`,
      );

      const document = await this.documentsRepository.save({
        documentType: data.documentType,
        metadata: data.metadata,
        fileUrl,
        employee,
      });

      return {
        docIdentifierId: document.id,
      };
    } catch (err) {
      this.Logger.error(`There was en Error - ${err}`);
      throw new InternalServerErrorException('Error uploading document');
    }
  }
}
