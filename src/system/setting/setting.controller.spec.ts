import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'jest-mock-extended';
import { NotFoundException } from '@nestjs/common';
import { SettingController } from './setting.controller';
import { SettingService } from './setting.service';
import { Setting } from './setting.entity';

describe('Setting Controller', () => {
  let controller: SettingController;
  const settingService = mock<SettingService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SettingController],
      providers: [
        {
          provide: SettingService,
          useValue: settingService,
        },
      ],
    }).compile();

    controller = module.get<SettingController>(SettingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllSettings', () => {
    const settings = [
      new Setting({ key: 'contacPhone', value: '123456789' }),
      new Setting({ key: 'contactEmail', value: 'abc@example.com' }),
    ];

    it('should return all settings', async () => {
      settingService.getAllSettings.mockResolvedValueOnce(settings);
      await expect(controller.getAllSettings()).resolves.toBe(settings);
    });
  });

  describe('getSettingValue', () => {
    it('should return all settings', async () => {
      settingService.getSettingValue.mockResolvedValueOnce('abc@m.com');
      await expect(controller.getSettingValue('contactEmail')).resolves.toBe('abc@m.com');
      expect(settingService.getSettingValue).toHaveBeenCalledWith('contactEmail');
    });
    it('should throw error', async () => {
      settingService.getSettingValue.mockResolvedValueOnce(undefined);
      await expect(controller.getSettingValue('contactEmail')).rejects.toEqual(
        expect.any(NotFoundException),
      );
    });
  });
});
