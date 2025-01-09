import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityController } from './activity/activity.controller';
import { Activity } from './activity/activity.entity';
import { ActivityService } from './activity/activity.service';
import { StatController } from './stat/stat.controller';
import { StatService } from './stat/stat.service';
import { TagController } from './tag/tag.controller';
import { Tag } from './tag/tag.entity';
import { TagService } from './tag/tag.service';

@Module({
  imports: [TypeOrmModule.forFeature([Activity, Tag])],
  controllers: [ActivityController, TagController, StatController],
  providers: [ActivityService, TagService, StatService],
})
export class DiaryModule {}
