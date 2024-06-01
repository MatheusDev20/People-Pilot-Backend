import {
  FileTypeValidator,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';

export const AvatarFileValidations = [
  new FileTypeValidator({ fileType: /^image\/(jpeg|png)$/ }),
  new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
];

export const DocumentsFileValidations = [
  new FileTypeValidator({ fileType: /^application\/pdf$/ }),
  new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
];

export const BrandImageValidations = [
  new FileTypeValidator({ fileType: /^image\/(jpeg|png)$/ }),
  new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
];

export const AvatarPipeInstance = new ParseFilePipe({
  validators: AvatarFileValidations,
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
});

export const DocumentPipeInstance = new ParseFilePipe({
  validators: DocumentsFileValidations,
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
});

export const BrandImagePipeInstance = new ParseFilePipe({
  validators: BrandImageValidations,
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
});
