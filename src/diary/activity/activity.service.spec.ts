import { mock } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoRepository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ObjectId } from 'mongodb';
import { NotFoundException } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { Activity, ActivityQuery } from './activity.entity';
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
    eventEmitter.emit.mockReset();
    activityRepo.findAndCount.mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addActivity', () => {
    it('should success', async () => {
      const dto: AddActivityDto = {
        content: 'test',
        time: '2021-10-10',
        income: 0,
        outcome: 0,
        tags: ['abc', 'def'],
      };
      const activity = mock<Activity>();
      activityRepo.save.mockResolvedValueOnce(activity);
      const findOneByIdOrFail = jest.spyOn(service, 'findOneByIdOrFail');
      findOneByIdOrFail.mockResolvedValueOnce(activity);
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
      findOneByIdOrFail.mockRestore();
    });
  });

  describe('updateActivity', () => {
    it('should success', async () => {
      const id = '60b1fd2e3c588c0bb68405e7';
      const dto: UpdateActivityDto = {
        content: 'test',
        time: '2021-10-10',
        income: 0,
        outcome: 0,
        tags: ['abc', 'def'],
      };
      await expect(service.updateActivity(id, dto)).resolves.toEqual(
        expect.objectContaining({
          ...dto,
          id: new ObjectId(id),
          time: new Date(dto.time),
        }),
      );
      expect(activityRepo.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: new ObjectId(id) },
        { $set: expect.objectContaining({ ...dto, time: new Date(dto.time) }) },
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

  describe('findOneByIdOrFail', () => {
    const id = '60b1fd2e3c588c0bb68405e7';

    it('should return data', async () => {
      const activity = mock<Activity>();
      activityRepo.findOneOrFail.mockResolvedValueOnce(activity);

      await expect(service.findOneByIdOrFail(id)).resolves.toBe(activity);
      expect(activityRepo.findOneOrFail).toHaveBeenCalledWith(id);
    });

    it('should throw not found exception', async () => {
      activityRepo.findOneOrFail.mockRejectedValueOnce('some error');
      await expect(service.findOneByIdOrFail(id)).rejects.toEqual(expect.any(NotFoundException));
    });
  });

  describe('deleteActivity', () => {
    it('should success', async () => {
      const id = '60b1fd2e3c588c0bb68405e7';
      const activity = mock<Activity>();
      const findOneByIdOrFail = jest.spyOn(service, 'findOneByIdOrFail');
      findOneByIdOrFail.mockResolvedValueOnce(activity);

      await expect(service.deleteActivity(id)).resolves.toBeUndefined();
      expect(activityRepo.findOneAndDelete).toHaveBeenCalledWith({ _id: new ObjectId(id) });
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        'activity.removed',
        expect.objectContaining({
          type: ActivityEventType.Removed,
          activity,
        }),
      );
      findOneByIdOrFail.mockRestore();
    });
  });

  describe('findAll', () => {
    it('should return activities without text in query', async () => {
      const query: ActivityQuery = {
        offset: 0,
        limit: 10,
      };

      await service.findAll(query);
      expect(activityRepo.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        withDeleted: false,
        where: {},
        order: {
          time: 'DESC',
        },
      });
    });

    it('should return activities with text', async () => {
      const query: ActivityQuery = {
        offset: 0,
        limit: 10,
        text: 'text',
      };

      await service.findAll(query);
      expect(activityRepo.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        withDeleted: false,
        order: {
          time: 'DESC',
        },
        where: {
          $text: { $search: query.text },
        },
      });
    });

    it('should return activities with tags', async () => {
      const query: ActivityQuery = {
        offset: 0,
        limit: 10,
        tags: ['abc'],
      };

      await service.findAll(query);
      expect(activityRepo.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        withDeleted: false,
        order: {
          time: 'DESC',
        },
        where: {
          tags: { $elemMatch: { $in: query.tags } },
        },
      });
    });
  });
});
