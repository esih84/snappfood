import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  UploadedFile,
} from '@nestjs/common';

export function UploadImage() {
  return UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
        new FileTypeValidator({ fileType: 'image/(png|jpg|jpeg|webp)' }),
      ],
    }),
  );
}
