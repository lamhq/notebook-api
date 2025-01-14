import { ApiProperty } from '@nestjs/swagger';

/**
 * The required parameters sent to the API for querying items using pagination
 */
export interface PaginationQuery {
  offset?: number;
  limit?: number;
}

/**
 * Response sent to client in case of an error
 */
export class ErrorResponse {
  @ApiProperty()
  code: string;

  @ApiProperty()
  message: string;

  constructor(data: Partial<ErrorResponse>) {
    Object.assign(this, data);
  }
}

/**
 * Object contain validation errors
 */
export class Errors {
  [field: string]: string | Errors;
}

/**
 * Response sent to client in case of a validation error
 */
export class ValidationErrorResponse extends ErrorResponse {
  @ApiProperty({
    type: Errors,
    example: {
      field1: 'This field is required',
      field2: 'Minimum length is 6',
    },
  })
  errors: Errors;

  constructor(data: Partial<ValidationErrorResponse>) {
    super(data);
    Object.assign(this, data);
  }
}
