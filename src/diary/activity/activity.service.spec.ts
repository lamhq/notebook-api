import { mock } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoRepository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ObjectId } from 'mongodb';
import { ActivityService } from './activity.service';
import { Activity } from './activity.entity';
import { AddActivityDto } from './dto/add-activity.dto';
import { ActivityEventType } from './activity.event';
import { UpdateActivityDto } from './dto/update-activity.dto';

describe('ActivityService', () => {
  let service: ActivityService;
  const activityRepo = mock<MongoRepository<Activity>>();
  const eventEmitter = mock<EventEmitter2>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityService,
        {
          provide: getRepositoryToken(Activity),
          useValue: activityRepo,
        },
        {
          provide: EventEmitter2,
          useValue: eventEmitter,
        },
      ],
    }).compile();

    service = module.get<ActivityService>(ActivityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
      const activity = mock<Activity>();
      activityRepo.save.mockResolvedValueOnce(activity);
      await expect(service.addActivity(dto)).resolves.toBe(activity);

      expect(activityRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          content: dto.content,
          income: dto.income,
          outcome: dto.outcome,
          tags: dto.tags.map((tag) => tag.trim()),
        }),
      );
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'activity.created',
        expect.objectContaining({
          type: ActivityEventType.Created,
          activity,
        }),
      );
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
      await expect(service.updateActivity(id, dto)).resolves.toEqual(
        expect.objectContaining({
          ...dto,
          id: new ObjectId(id),
          createdAt: new Date(dto.createdAt),
        }),
      );
      expect(activityRepo.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: new ObjectId(id) },
        { $set: expect.objectContaining({ ...dto, createdAt: new Date(dto.createdAt) }) },
      );
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'activity.updated',
        expect.objectContaining({
          type: ActivityEventType.Updated,
          activity: expect.any(Activity),
        }),
      );
    });
  });
});
