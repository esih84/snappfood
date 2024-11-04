import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import path from 'path';

@Injectable()
export class S3Service {
  // get instance from s3  To work with s3 client
  private readonly s3: S3;
  constructor() {
    this.s3 = new S3({
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
      },
      endpoint: process.env.s3_ENDPOINT,
      region: 'default',
    });
  }
  async uploadFile(file: Express.Multer.File, folderName: string) {
    const ext = path.extname(file.originalname);
    return await this.s3
      .upload({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${folderName}/${Date.now()}${ext}`,
        Body: file.buffer,
      })
      .promise();
  }
  async deleteFile(Key: string) {
    return await this.s3
      .deleteObject({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: decodeURI(Key),
      })
      .promise();
  }
}
