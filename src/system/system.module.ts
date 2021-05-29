import { Module } from '@nestjs/common';
import { SettingController } from './setting/setting.controller';
import { SettingService } from './setting/setting.service';
import { UploadController } from './upload/upload.controller';
import { UploadService } from './upload/upload.service';

@Module({
  controllers: [SettingController, UploadController],
  providers: [SettingService, UploadService],
})
export class SystemModule {}
