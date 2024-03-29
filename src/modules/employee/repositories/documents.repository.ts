import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Documents } from '../entities/documents.entity';
import { Repository } from 'typeorm';
import { UploadDocumentDTO } from '../DTOs';
import { Employee } from '../entities/employee.entity';

@Injectable()
export class DocumentsRepository {
  constructor(
    @InjectRepository(Documents) private repository: Repository<Documents>,
  ) {}

  async save(
    data: UploadDocumentDTO & { employee: Employee; fileUrl: string },
  ): Promise<{ id: string }> {
    const { id } = await this.repository.save(data);
    return { id };
  }
}
