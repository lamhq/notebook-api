import { mock } from 'jest-mock-extended';
import { TestingModule, Test } from '@nestjs/testing';
import { ValidationArguments } from 'class-validator';
import { PasswordValidator } from './is-password-match.decorator';
import { CommonService } from './common.service';

describe('PasswordValidator', () => {
  let validator: PasswordValidator;
  const commonService = mock<CommonService>();
  const value = 'new-pwd';
  const hashed = 'hashed';
  const validationArguments = mock<ValidationArguments>({
    constraints: [hashed],
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PasswordValidator,
        {
          provide: CommonService,
          useValue: commonService,
        },
      ],
    }).compile();
    validator = await module.get<PasswordValidator>(PasswordValidator);
  });

  describe('validate', () => {
    it('should pass', async () => {
      commonService.comparePassword.mockResolvedValueOnce(true);
      await expect(validator.validate(value, validationArguments)).resolves.toBe(true);
      expect(commonService.comparePassword).toHaveBeenCalledWith(value, hashed);
    });

    it('should fail', async () => {
      commonService.comparePassword.mockResolvedValueOnce(false);
      await expect(validator.validate(value, validationArguments)).resolves.toBe(false);
    });
  });
});
