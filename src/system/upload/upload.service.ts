import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import hmacSHA256 from 'crypto-js/hmac-sha256';
import cryptoJs from 'crypto-js';
import { Configuration } from 'src/config';
import { UploadToken } from './upload-params';

export interface SignParamameters {
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  service: string;
  expiration: string;
  date: string;
  keyPrefix: string;
}

@Injectable()
export class UploadService {
  private readonly awsConfig: Configuration['aws'];

  constructor(configService: ConfigService) {
    const awsConfig = configService.get<Configuration['aws']>('aws');
    if (!awsConfig) {
      throw new Error('Invalid system configuration. AWS config is not set.');
    }
    this.awsConfig = awsConfig;
  }

  getStringToSign(params: SignParamameters): string {
    const { bucket, accessKeyId, region, service, expiration, date, keyPrefix } = params;
    const policy = {
      expiration,
      conditions: [
        { bucket },
        { success_action_status: '200' },
        ['starts-with', '$key', keyPrefix],
        { acl: 'public-read' },
        ['starts-with', '$Content-Type', 'image/'],
        { 'x-amz-algorithm': 'AWS4-HMAC-SHA256' },
        { 'x-amz-credential': `${accessKeyId}/${date}/${region}/${service}/aws4_request` },
        { 'x-amz-date': `${date}T000000Z` },
      ],
    };
    return Buffer.from(JSON.stringify(policy), 'utf-8').toString('base64');
  }

  getSignature(params: SignParamameters): string {
    const { region, service, secretAccessKey, date } = params;
    const base64Policy = this.getStringToSign(params);
    const dateKey = hmacSHA256(date, `AWS4${secretAccessKey}`);
    const regionKey = hmacSHA256(region, dateKey);
    const serviceKey = hmacSHA256(service, regionKey);
    const signatureKey = hmacSHA256('aws4_request', serviceKey);
    return hmacSHA256(base64Policy, signatureKey).toString(cryptoJs.enc.Hex);
  }

  getUploadToken(): UploadToken {
    const { bucket, s3Endpoint, s3Prefix, region, accessKeyId, secretAccessKey } = this.awsConfig;
    const service = 's3';
    const duration = 10; // minutes
    const expireAt = new Date();
    expireAt.setMinutes(expireAt.getMinutes() + duration);
    const date = expireAt.toISOString().substr(0, 10).replace(/-/g, '');
    const amzDate = `${date}T000000Z`;
    const params: SignParamameters = {
      accessKeyId,
      secretAccessKey,
      bucket,
      region,
      service,
      expiration: expireAt.toISOString(),
      date,
      keyPrefix: s3Prefix,
    };
    // convert the link from https to http because s3 static web host does not support https
    const fileUrl = `${s3Endpoint}/${s3Prefix}{filename}`;
    const credential = `${accessKeyId}/${date}/${region}/${service}/aws4_request`;
    return new UploadToken({
      fileUrl,
      uploadUrl: `https://${bucket}.s3.amazonaws.com/`,
      key: `${s3Prefix}{filename}`,
      acl: 'public-read',
      successActionStatus: '200',
      policy: this.getStringToSign(params),
      signature: this.getSignature(params),
      credential,
      date: amzDate,
      algorithm: 'AWS4-HMAC-SHA256',
    });
  }
}
