import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { Readable } from 'stream';

import { AppConfigService } from '../common/services';
import { CONFIG_PROVIDER_TOKEN } from '../common/services/types';

@Injectable()
export class MediaStorageService {
  private readonly s3: S3;

  constructor(
    @Inject(CONFIG_PROVIDER_TOKEN)
    private readonly configService: AppConfigService
  ) {
    this.s3 = new S3({
      endpoint: this.configService.mediaStorageConfig.endpoint,
      secretAccessKey: this.configService.mediaStorageConfig.secretAccessKey,
      accessKeyId: this.configService.mediaStorageConfig.accessKeyId,
      s3ForcePathStyle: true,
      signatureVersion: 'v4',
    });
    this.init();
  }

  async init(): Promise<void> {
    const listBuckets = await this.s3.listBuckets().promise();
    if (!listBuckets.Buckets?.filter((b: { Name: string; }) => b.Name === this.configService.mediaStorageConfig.bucketImageName).length) {
      await this.s3.createBucket({ Bucket: `${this.configService.mediaStorageConfig.bucketImageName}`, }).promise();
    }
  }

  async upload(key: string, file: Buffer): Promise<void> {
    const readStream = this.bufferToStream(file);
    await this.s3.upload({
      Bucket: this.configService.mediaStorageConfig.bucketImageName,
      Key: key,
      Body: readStream,
    }).promise();
  }

  async getObject(key: string, bucket: string): Promise<Readable> {
    const file = await this.s3.getObject({
      Bucket: bucket,
      Key: key,
    }).promise();
    if (!file) {
      throw new NotFoundException('File not found');
    }
    return this.bufferToStream(file.Body as Buffer);
  }

  private bufferToStream(buffer: Buffer): Readable {
    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    return stream;
  }
}
