import { mock } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoRepository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { TagService } from './tag.service';
import { Tag } from './tag.entity';
import { ActivityEvent, ActivityEventType } from '../activity/activity.event';

describe('TagService', () => {
  let service: TagService;
  const tagRepo = mock<MongoRepository<Tag>>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagService,
        {
          provide: getRepositoryToken(Tag),
          useValue: tagRepo,
        },
      ],
    }).compile();

    service = module.get<TagService>(TagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleActivityChange', () => {
    it('should save tag when activty changed', async () => {
      const tag = 'abc';
      const event = mock<ActivityEvent>({
        type: ActivityEventType.Created,
        activity: {
          tags: [tag],
        },
      });
      await expect(service.handleActivityChange(event)).resolves.toBeUndefined();
      expect(tagRepo.updateOne).toHaveBeenCalledWith(
        { name: tag },
        { $set: { name: tag } },
        { upsert: true },
      );
    });
  });

  describe('findAll', () => {
    it('should return tags', async () => {
      await expect(service.findAll()).resolves.toBeUndefined();
      expect(tagRepo.find).toHaveBeenCalledWith({
        order: { name: 'ASC' },
      });
    });
  });

  describe('findAllTagNames', () => {
    it('should return tag names', async () => {
      tagRepo.find.mockResolvedValueOnce([
        { id: new ObjectId('60b314a6741b630ecbf5c6f4'), name: 'abc' },
        { id: new ObjectId('60b314a6741b630ecbf5c6fe'), name: 'def' },
      ]);
      await expect(service.findAllTagNames()).resolves.toEqual(['abc', 'def']);
    });
  });
});
