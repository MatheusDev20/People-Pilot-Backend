import { IsIn, IsNotEmpty, IsOptional, IsJSON} from 'class-validator';
import { AVAILABLE_DOCUMENTS } from '../utils/constants';

export class UploadDocumentDTO {
  @IsNotEmpty()
  @IsIn(AVAILABLE_DOCUMENTS)
  documentType: string;

  @IsOptional()
  @IsJSON()
  metadata: Record<string, any>;
}
