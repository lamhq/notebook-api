import { Injectable, ValidationPipe as CoreValidationPipe, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ValidationPipe extends CoreValidationPipe {
  public async transform(value: unknown, metadata: ArgumentMetadata): Promise<unknown> {
    // skip validation for Date object
    if (metadata.metatype === Date) {
      return value;
    }
    return super.transform(value, metadata);
  }
}
