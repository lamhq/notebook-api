import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'jest-mock-extended';
import { MongoRepository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AggregationCursor } from 'mongodb';
import { StatService } from './stat.service';
import { Activity } from '../activity/activity.entity';
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
    it('should run without parameters', async () => {
      const revenue: Revenue = { income: 10, outcome: 20 };
      const cursor = mock<AggregationCursor<Revenue>>();
      cursor.toArray.mockImplementation(() => Promise.resolve([revenue]));
      activityRepo.aggregate.mockReturnValue(cursor);

      await expect(service.getRevenue()).resolves.toBe(revenue);
      expect(activityRepo.aggregate).toHaveBeenCalledWith([
        {
          $group: { _id: 'all', income: { $sum: '$income' }, outcome: { $sum: '$outcome' } },
        },
      ]);
    });

    it('should run with parameters', async () => {
      const revenue: Revenue = { income: 10, outcome: 20 };
      const cursor = mock<AggregationCursor<Revenue>>();
      cursor.toArray.mockImplementation(() => Promise.resolve([revenue]));
      activityRepo.aggregate.mockReturnValue(cursor);
      const from = new Date();

      await expect(service.getRevenue(from)).resolves.toBe(revenue);
      expect(activityRepo.aggregate).toHaveBeenCalledWith([
        { $match: { time: { $gt: from } } },
        {
          $group: { _id: 'all', income: { $sum: '$income' }, outcome: { $sum: '$outcome' } },
        },
      ]);
    });
  });
});
