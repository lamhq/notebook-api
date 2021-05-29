import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'jest-mock-extended';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

describe('Upload Controller', () => {
  let controller: UploadController;
  const uploadService = mock<UploadService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [
        // mock UploadService
        {
          provide: UploadService,
          useValue: uploadService,
        },
      ],
    }).compile();

    controller = module.get<UploadController>(UploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUploadToken', () => {
    it('should success', async () => {
      await controller.getUploadToken();
      expect(uploadService.getUploadToken).toHaveBeenCalled();
    });
  });
});
