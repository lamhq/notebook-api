import { mock } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

describe('Tag Controller', () => {
  let controller: TagController;
  const tagService = mock<TagService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagController],
      providers: [
        {
          provide: TagService,
          useValue: tagService,
        },
      ],
    }).compile();

    controller = module.get<TagController>(TagController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should success', async () => {
      tagService.findAllTagNames.mockResolvedValueOnce([]);
      await expect(controller.findAll()).resolves.toEqual([]);
      expect(tagService.findAllTagNames).toHaveBeenCalled();
    });
  });
});
