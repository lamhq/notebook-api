import { mock } from 'jest-mock-extended';
import { TestingModule, Test } from '@nestjs/testing';
import { ValidationArguments } from 'class-validator';
import { UniqueValueValidator } from './is-unique-value.decorator';

describe('UniqueValueValidator', () => {
  let validator: UniqueValueValidator;
  const validationArguments = mock<ValidationArguments>({
    constraints: ['1', '2', '3'],
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UniqueValueValidator],
    }).compile();
    validator = await module.get<UniqueValueValidator>(UniqueValueValidator);
  });

  describe('validate', () => {
    it('should pass', async () => {
      await expect(validator.validate('4', validationArguments)).resolves.toBe(true);
    });

    it('should fail', async () => {
      await expect(validator.validate('1', validationArguments)).resolves.toBe(true);
    });
  });
});
