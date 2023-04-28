import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
class ImageService {
  private readonly s3 = new AWS.S3();

  constructor(private readonly configService: ConfigService) {
    this.s3.config.update({
      credentials: {
        accessKeyId: this.configService.get('awsConfig.uid'),
        secretAccessKey: this.configService.get('awsConfig.secret'),
      },
      region: this.configService.get('awsConfig.region'),
    });
  }

  async uploadImage(filename: string, b64Image: string, mimeType: string) {
    const image = Buffer.from(b64Image, 'base64');
    const result = await this.s3
      .upload({
        Bucket: this.configService.get('awsConfig.bucket'),
        Key: filename,
        Body: image,
        ACL: 'public-read',
        ContentType: mimeType,
        ContentDisposition: 'inline',
      })
      .promise();
    return result.Location;
  }
}

export default ImageService;
