import { ApiProperty } from '@nestjs/swagger';
import { LENGTH_INPUT_ERROR, REQUIRED_INPUT_ERROR } from '../constants/error';

export class ErrorResponse {
  @ApiProperty({
    example: {
      field1: REQUIRED_INPUT_ERROR,
      field2: LENGTH_INPUT_ERROR,
    },
  })
  details?: Record<string, string>;

  @ApiProperty({ example: 'Invalid input' })
  message: string;
}
