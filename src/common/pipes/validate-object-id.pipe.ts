import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { INVALID_ID } from '../constants/error';

@Injectable()
export class ValidateObjectId implements PipeTransform<string> {
  transform(value: string): string {
    const isValid = ObjectId.isValid(value);
    if (!isValid) {
      throw new BadRequestException({ error: INVALID_ID });
    }
    return value;
  }
}
