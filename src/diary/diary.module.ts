import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import { ActivityController } from './activity/activity.controller';
import { Activity } from './activity/activity.entity';
import { ActivityService } from './activity/activity.service';
import { Tag } from './tag/tag.entity';
import { TagService } from './tag/tag.service';
import { TagController } from './tag/tag.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Activity, Tag]), CommonModule],
  controllers: [ActivityController, TagController],
  providers: [ActivityService, TagService],
})
export class DiaryModule {}
