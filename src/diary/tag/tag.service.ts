import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ActivityEvent, ActivityEventType } from '../activity/activity.event';
import { Tag } from './tag.entity';

@Injectable()
export class TagService {
  constructor(@InjectRepository(Tag) private tagRepo: MongoRepository<Tag>) {}

  @OnEvent('activity.*')
  async handleActivityChange(event: ActivityEvent): Promise<void> {
    if (event.type === ActivityEventType.Created || event.type === ActivityEventType.Updated) {
      await Promise.all(
        event.activity.tags.map(async (tag) => {
          await this.tagRepo.updateOne({ name: tag }, { $set: { name: tag } }, { upsert: true });
        }),
      );
    }
  }
}
