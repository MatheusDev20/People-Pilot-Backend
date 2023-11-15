import {
  FileTypeValidator,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';

export const fileValidations = [
  new FileTypeValidator({ fileType: /^image\/(jpeg|png)$/ }),
  new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
];

export const pipeInstance = new ParseFilePipe({
  validators: fileValidations,
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
});
