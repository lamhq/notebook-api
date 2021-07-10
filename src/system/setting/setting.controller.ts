import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiTags, ApiNotFoundResponse } from '@nestjs/swagger';
import { Setting } from './setting.entity';
import { SettingService } from './setting.service';

@Controller('system/settings')
@ApiTags('System')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Get()
  @ApiOperation({ summary: 'Get all system settings' })
  @ApiOkResponse({ description: 'System setting', type: [Setting] })
  async getAllSettings(): Promise<Setting[]> {
    return this.settingService.getAllSettings();
  }

  @Get(':key')
  @ApiOperation({ summary: "Get setting's value by key" })
  @ApiOkResponse({ description: 'Setting value', type: String })
  @ApiNotFoundResponse({ description: 'Setting not found' })
  async getSettingValue(@Param('key') key: string): Promise<string> {
    const result = await this.settingService.getSettingValue(key);
    if (!result) {
      throw new NotFoundException('Setting not found');
    }
    return result;
  }
}
