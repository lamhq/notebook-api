import { TestingModule, Test } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ParseDatePipe } from './parse-date.pipe';

describe('ParseDatePipe', () => {
  let pipe: ParseDatePipe;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParseDatePipe],
    }).compile();
    pipe = module.get<ParseDatePipe>(ParseDatePipe);
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  describe('transform', () => {
    it('should pass validation', async () => {
      const value = '2020-10-25T10:18:10.502Z';
      expect(pipe.transform(value)).toEqual(new Date(value));
    });

    it('should throw exception', async () => {
      const value = 'abcd';
      expect(() => pipe.transform(value)).toThrow(BadRequestException);
    });
  });
});
