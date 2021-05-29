import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Activity } from './activity.entity';
import { ActivityEvent, ActivityEventType } from './activity.event';
import { AddActivityDto } from './dto/add-activity.dto';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity) private activityRepo: MongoRepository<Activity>,
    private eventEmitter: EventEmitter2,
  ) {}

  async addActivity(dto: AddActivityDto): Promise<Activity> {
    const activity = new Activity({
      content: dto.content,
      createdAt: new Date(dto.createdAt),
      income: dto.income,
      outcome: dto.outcome,
      tags: dto.tags.map((tag) => tag.trim()),
    });
    const saved = await this.activityRepo.save(activity);
    this.eventEmitter.emit(
      'activity.created',
      new ActivityEvent({
        type: ActivityEventType.Created,
        activity: saved,
      }),
    );
    return saved;
  }
}
