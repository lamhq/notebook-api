import { BadRequestException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

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
      [currentValue.property]: currentValue.children
        ? currentValue.children.map((item) => getErrorDetails(item.children!))
        : undefined,
    };
  }, {});
}

export class InputErrorException extends BadRequestException {
  constructor(errors: ValidationError[] | ErrorDetails) {
    const details = Array.isArray(errors) ? getErrorDetails(errors) : errors;
    super({
      message: 'Invalid form data',
      statusCode: HttpStatus.BAD_REQUEST,
      details,
    });
  }
}
