import { Injectable, Logger } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class AssetsService {
  private readonly logger = new Logger(AssetsService.name);
  private readonly s3: S3Client;
  private readonly bucket: string;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
    this.bucket = process.env.AWS_S3_BUCKET!;
  }

  async generatePresignedUrl(key: string, expiresIn = 3600): Promise<string> {
    const command = new PutObjectCommand({ Bucket: this.bucket, Key: key });
    return getSignedUrl(this.s3, command, { expiresIn });
  }

  async getObject(key: string) {
    const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    return this.s3.send(command);
  }

  async listObjects(prefix = '') {
    const command = new ListObjectsV2Command({
      Bucket: this.bucket,
      Prefix: prefix,
    });
    return this.s3.send(command);
  }

  async putObject(key: string, body: Buffer | string, contentType?: string) {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    });
    return this.s3.send(command);
  }

  async deleteObject(key: string) {
    const command = new DeleteObjectCommand({ Bucket: this.bucket, Key: key });
    return this.s3.send(command);
  }

  async headObject(key: string) {
    // S3 supports keys with slashes ("folders" are just part of the key string)
    const command = new HeadObjectCommand({ Bucket: this.bucket, Key: key });
    return this.s3.send(command);
  }
}
