import { Test, TestingModule } from '@nestjs/testing';
import { SettingService } from './setting.service';

describe('SettingService', () => {
  let service: SettingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SettingService],
    }).compile();

    service = module.get<SettingService>(SettingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllSettings', () => {
    it('should return settings', async () => {
      await expect(service.getAllSettings()).resolves.toContainEqual(
        expect.objectContaining({
          key: expect.any(String),
          value: expect.any(String),
        }),
      );
    });
  });

  describe('getSettingValue', () => {
    it('should return setting value', async () => {
      await expect(service.getSettingValue('contacPhone')).resolves.toEqual(expect.any(String));
    });

    it('should return undefined', async () => {
      await expect(service.getSettingValue('contacPhone1')).resolves.toBeUndefined();
    });
  });
});
