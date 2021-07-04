import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository, ObjectLiteral } from 'typeorm';
import { Activity } from '../activity/activity.entity';
import { Revenue } from './revenue.entity';

@Injectable()
export class StatService {
  constructor(@InjectRepository(Activity) private activityRepo: MongoRepository<Activity>) {}

  async getRevenue(from?: Date, to?: Date): Promise<Revenue> {
    const pipes: ObjectLiteral[] = [];
    if (from || to) {
      const conditions: ObjectLiteral = {};
      if (from) {
        conditions.$gt = from;
      }
      if (to) {
        conditions.$lt = to;
      }
      pipes.push({ $match: { time: conditions } });
    }
    pipes.push({
      $group: { _id: 'all', income: { $sum: '$income' }, outcome: { $sum: '$outcome' } },
    });
    const result = await this.activityRepo.aggregate<Revenue>(pipes).toArray();
    return result[0];
  }
}
