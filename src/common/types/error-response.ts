import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponse {
  @ApiProperty({
    example: {
      field1: 'This field is required',
      field2: 'Minimum length is 6',
    },
  })
  details?: Record<string, string>;

  @ApiProperty({ example: 'Invalid input' })
  message: string;
}
