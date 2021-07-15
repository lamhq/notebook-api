import { Injectable, ValidationPipe, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ObjectValidationPipe extends ValidationPipe {
  public async transform(value: unknown, metadata: ArgumentMetadata): Promise<unknown> {
    // skip validation for Date object
    if (metadata.metatype === Date) {
      return value;
    }
    return super.transform(value, metadata);
  }
}
