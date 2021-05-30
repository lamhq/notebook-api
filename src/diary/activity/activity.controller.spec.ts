import { mock, mockDeep } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { AddActivityDto } from './dto/add-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { Activity, ActivityQuery } from './activity.entity';

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

  describe('updateActivity', () => {
    it('should success', async () => {
      const id = '60b1fd2e3c588c0bb68405e7';
      const dto: UpdateActivityDto = {
        content: 'test',
        createdAt: '2021-10-10',
        income: 0,
        outcome: 0,
        tags: ['abc', 'def'],
      };
      await expect(controller.updateActivity(id, dto)).resolves.toBeUndefined();
      expect(activityService.updateActivity).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('deleteActivity', () => {
    it('should success', async () => {
      const id = '60b1fd2e3c588c0bb68405e7';
      await expect(controller.deleteActivity(id)).resolves.toBeUndefined();
      expect(activityService.deleteActivity).toHaveBeenCalledWith(id);
    });
  });

  describe('findAll', () => {
    it('should success', async () => {
      const text = 'text';
      const query: ActivityQuery = {
        offset: 0,
        limit: 10,
        text,
      };
      const req = mockDeep<Request>();
      const result: [Activity[], number] = [[mock<Activity>()], 10];
      activityService.findAll.mockResolvedValueOnce(result);
      await expect(
        controller.findAll(
          req,
          query.text,
          query.from,
          query.to,
          query.tags,
          query.offset,
          query.limit,
        ),
      ).resolves.toBe(result[0]);
      expect(activityService.findAll).toHaveBeenCalledWith(query);
    });
  });
});
