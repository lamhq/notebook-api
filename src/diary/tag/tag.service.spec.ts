import { mock } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoRepository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
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
});
