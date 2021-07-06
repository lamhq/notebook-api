import { mock } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';
import { StatController } from './stat.controller';
import { StatService } from './stat.service';
import { ActivityQuery } from '../activity/activity.entity';

describe('Stat Controller', () => {
  let controller: StatController;
  const statService = mock<StatService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatController],
      providers: [
        {
          provide: StatService,
          useValue: statService,
        },
      ],
    }).compile();

    controller = module.get<StatController>(StatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getRevenue', () => {
    it('should success', async () => {
      const query: ActivityQuery = {
        text: 'text',
        from: new Date('2020-10-25T10:18:10.502Z'),
        to: new Date('2021-10-25T10:18:10.502Z'),
      };
      const revenue = { income: 10, outcome: 20 };
      statService.getRevenue.mockResolvedValueOnce(revenue);

      await expect(
        controller.getRevenue(query.text, query.tags, query.from, query.to),
      ).resolves.toEqual(revenue);
      expect(statService.getRevenue).toHaveBeenCalledWith(query);
    });
  });
});
