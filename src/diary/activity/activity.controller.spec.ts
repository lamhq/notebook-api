import { mock } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { AddActivityDto } from './dto/add-activity.dto';

describe('Activity Controller', () => {
  let controller: ActivityController;
  const activityService = mock<ActivityService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivityController],
      providers: [
        {
          provide: ActivityService,
          useValue: activityService,
        },
      ],
    }).compile();

    controller = module.get<ActivityController>(ActivityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addActivity', () => {
    it('should success', async () => {
      const dto: AddActivityDto = {
        content: 'test',
        createdAt: '2021-10-10',
        income: 0,
        outcome: 0,
        tags: ['abc', 'def'],
      };
      await expect(controller.addActivity(dto)).resolves.toBeUndefined();
      expect(activityService.addActivity).toHaveBeenCalledWith(dto);
    });
  });
});
