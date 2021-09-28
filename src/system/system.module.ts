import { Module } from '@nestjs/common';
import { SettingController } from './setting/setting.controller';
import { SettingService } from './setting/setting.service';

@Module({
  controllers: [SettingController],
  providers: [SettingService],
})
export class SystemModule {}
