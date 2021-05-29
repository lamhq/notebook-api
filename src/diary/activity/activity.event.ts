import { Activity } from './activity.entity';

export enum ActivityEventType {
  Created = 'CREATED',
  Updated = 'UPDATED',
  Removed = 'REMOVED',
}

export class ActivityEvent {
  type: ActivityEventType;

  activity: Activity;

  constructor(partial: Partial<ActivityEvent>) {
    Object.assign(this, partial);
  }
}
