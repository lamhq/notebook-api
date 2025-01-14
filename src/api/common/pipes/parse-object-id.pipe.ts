import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ObjectId } from 'mongodb';

@Injectable()
export class ParseObjectIDPipe implements PipeTransform<string, ObjectId> {
  transform(value: string): ObjectId {
    if (!ObjectId.isValid(value)) {
      throw new BadRequestException('Invalid ObjectID');
    }
    return new ObjectId(value);
  }
}
