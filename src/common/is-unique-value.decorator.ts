import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@ValidatorConstraint({ async: true })
@Injectable()
export class UniqueValueValidator implements ValidatorConstraintInterface {
  async validate(value: string, validationArguments?: ValidationArguments): Promise<boolean> {
    if (!validationArguments || !validationArguments.constraints) {
      throw new InternalServerErrorException('Wrong arguments for UniqueValueValidator');
    }
    const values = validationArguments.constraints as string[];
    const isDuplicated = values.filter((item) => item === value).length > 1;
    return !isDuplicated;
  }
}

export function IsUniqueValue(values: string[], validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (object: Object, propertyName: string): void => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: values,
      validator: UniqueValueValidator,
    });
  };
}
