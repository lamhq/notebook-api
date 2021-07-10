import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CommonService } from './common.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class PasswordValidator implements ValidatorConstraintInterface {
  constructor(private commonService: CommonService) {}

  async validate(value: string, validationArguments?: ValidationArguments): Promise<boolean> {
    if (!validationArguments || !validationArguments.constraints) {
      throw new InternalServerErrorException('Wrong arguments for PasswordValidator');
    }
    const [hashed] = validationArguments.constraints as [string];
    return this.commonService.comparePassword(value, hashed);
  }
}

export function IsPasswordMatch(hashed: string, validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (object: Object, propertyName: string): void => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [hashed],
      validator: PasswordValidator,
    });
  };
}
