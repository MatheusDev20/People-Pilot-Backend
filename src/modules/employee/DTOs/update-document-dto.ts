import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { AVAILABLE_DOCUMENTS } from '../utils/constants';

export class UploadDocumentDTO {
  @IsNotEmpty()
  @IsIn(AVAILABLE_DOCUMENTS)
  documentType: string;

  @IsOptional()
  metadata: Record<string, any>;
}
