import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'jest-mock-extended';
import { SignParamameters, UploadService } from './upload.service';

describe('UploadService', () => {
  let service: UploadService;
  const mockAwsConfig = {
    accessKeyId: 'key',
    secretAccessKey: 'secret',
    bucket: 'example-bucket',
    region: 'eu-central-1',
    s3Prefix: 'upload/',
    s3Endpoint: 'http://example.com',
  };
  const expireAt = '3000-09-11T20:58:11.568Z';
  const params: SignParamameters = {
    accessKeyId: mockAwsConfig.accessKeyId,
    secretAccessKey: mockAwsConfig.secretAccessKey,
    bucket: mockAwsConfig.bucket,
    region: mockAwsConfig.region,
    service: 's3',
    expiration: expireAt,
    date: expireAt.substr(0, 10).replace(/-/g, ''),
    keyPrefix: mockAwsConfig.s3Prefix,
  };
  const configService = mock<ConfigService>();
  configService.get.mockReturnValue(mockAwsConfig);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        // mock configService
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    }).compile();

    service = module.get<UploadService>(UploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getStringToSign', () => {
    it('should match snapshot', () => {
      expect(service.getStringToSign(params)).toMatchSnapshot();
    });
  });

  describe('getSignature', () => {
    it('should match snapshot', () => {
      expect(service.getSignature(params)).toMatchSnapshot();
    });
  });

  describe('getUploadToken', () => {
    it('should match snapshot', () => {
      const expAt = new Date(expireAt);
      const spy = jest.spyOn(global, 'Date').mockReturnValue(expAt as unknown as string);
      expect(service.getUploadToken()).toMatchSnapshot();
      spy.mockRestore();
    });
  });
});
