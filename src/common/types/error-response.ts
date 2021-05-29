import { ApiProperty } from '@nestjs/swagger';
import { UNAVAILABLE_INPUT_ERROR, REQUIRED_INPUT_ERROR, INPUT_ERROR } from '../constants/error';

export class ErrorResponse {
  @ApiProperty({ example: INPUT_ERROR })
  error: string;

  @ApiProperty({
    example: {
      field1: UNAVAILABLE_INPUT_ERROR,
      field2: REQUIRED_INPUT_ERROR,
    },
  })
  details?: Record<string, string>;

  @ApiProperty({ example: 'Invalid input' })
  message: string;
}
