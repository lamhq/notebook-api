import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'jest-mock-extended';
import { MongoRepository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AggregationCursor } from 'mongodb';
import { StatService } from './stat.service';
import { Activity, ActivityQuery } from '../activity/activity.entity';
import { Revenue } from './revenue.entity';

describe('StatService', () => {
  let service: StatService;
  const activityRepo = mock<MongoRepository<Activity>>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatService,
        {
          provide: getRepositoryToken(Activity),
          useValue: activityRepo,
        },
      ],
    }).compile();

    service = module.get<StatService>(StatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRevenue', () => {
    const revenue: Revenue = { income: 10, outcome: 20 };
    const cursor = mock<AggregationCursor<Revenue>>();
    cursor.toArray.mockImplementation(() => Promise.resolve([revenue]));
    activityRepo.aggregate.mockReturnValue(cursor);

    it('should filter by text, time', async () => {
      const query: ActivityQuery = {
        text: 'abc',
        from: new Date(),
      };

      await expect(service.getRevenue(query)).resolves.toBe(revenue);
      expect(activityRepo.aggregate).toHaveBeenCalledWith([
        { $match: { $text: { $search: query.text }, time: { $gt: query.from } } },
        {
          $group: { _id: 'all', income: { $sum: '$income' }, outcome: { $sum: '$outcome' } },
        },
      ]);
    });

    it('should filter by tags', async () => {
      const query: ActivityQuery = {
        tags: ['abc'],
      };

      await expect(service.getRevenue(query)).resolves.toBe(revenue);
      expect(activityRepo.aggregate).toHaveBeenCalledWith([
        { $match: { tags: { $elemMatch: { $in: query.tags } } } },
        {
          $group: { _id: 'all', income: { $sum: '$income' }, outcome: { $sum: '$outcome' } },
        },
      ]);
    });
  });
});
