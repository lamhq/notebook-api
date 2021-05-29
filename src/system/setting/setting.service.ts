import { Injectable } from '@nestjs/common';
import { Setting } from './setting.entity';

@Injectable()
export class SettingService {
  private settings = [
    new Setting({ key: 'contacPhone', value: '123456789' }),
    new Setting({ key: 'contactEmail', value: 'abc@example.com' }),
  ];

  /**
   * Get all setting records
   */
  async getAllSettings(): Promise<Setting[]> {
    return this.settings;
  }

  /**
   * Get a single setting value by key
   */
  async getSettingValue(key: string): Promise<string | undefined> {
    const result = this.settings.find((item) => item.key === key);
    return result ? result.value : undefined;
  }
}
