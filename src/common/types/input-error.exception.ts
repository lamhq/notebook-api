import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { INPUT_ERROR } from '../constants/error';

type ErrorValue = string | [ErrorDetails];

export interface ErrorDetails {
  [x: string]: ErrorValue;
}

export function getErrorDetails(errors: ValidationError[]): ErrorDetails {
  return errors.reduce((previousValue, currentValue) => {
    if (currentValue.constraints) {
      return {
        ...previousValue,
        [currentValue.property]: Object.values(currentValue.constraints!)[0],
      };
    }
    return {
      ...previousValue,
      [currentValue.property]: currentValue.children.map((item) => getErrorDetails(item.children)),
    };
  }, {});
}

export class InputErrorException extends BadRequestException {
  constructor(errors: ValidationError[]) {
    super({
      error: INPUT_ERROR,
      details: getErrorDetails(errors),
    });
  }
}
