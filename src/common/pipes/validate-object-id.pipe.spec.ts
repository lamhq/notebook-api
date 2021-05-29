import { TestingModule, Test } from '@nestjs/testing';
import { ObjectId } from 'mongodb';
import { BadRequestException } from '@nestjs/common';
import { ValidateObjectId } from './validate-object-id.pipe';

describe('ValidateObjectId', () => {
  let pipe: ValidateObjectId;
  let mIsValid: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ValidateObjectId],
    }).compile();
    mIsValid = jest.spyOn(ObjectId, 'isValid');
    pipe = module.get<ValidateObjectId>(ValidateObjectId);
  });

  afterEach(() => {
    mIsValid.mockRestore();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  describe('transform', () => {
    it('should pass validation', async () => {
      const value = '1234';
      mIsValid.mockReturnValueOnce(true);
      expect(pipe.transform(value)).toBe(value);
    });

    it('should throw exception', async () => {
      mIsValid.mockReturnValueOnce(false);
      expect(() => pipe.transform('1234')).toThrow(BadRequestException);
    });
  });
});
