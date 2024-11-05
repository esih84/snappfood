import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { MulterField } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { memoryStorage } from 'multer';

export function UploadFileS3(fieldName: string) {
  return class UploadUtility extends FileInterceptor(fieldName, {
    storage: memoryStorage(),
  }) {};
}

export function UploadFieldsS3(uploadFields: MulterField[]) {
  return class UploadUtilities extends FileFieldsInterceptor(uploadFields, {
    storage: memoryStorage(),
  }) {};
}
