import { IsNotEmpty, IsOptional, IsPositive } from 'class-validator';
import { REQUIRED_INPUT_ERROR } from 'src/common/constants/error';
import { ApiProperty } from '@nestjs/swagger';

export class AddActivityDto {
  @ApiProperty()
  @IsNotEmpty({ message: REQUIRED_INPUT_ERROR })
  content: string;

  @ApiProperty()
  @IsNotEmpty({ message: REQUIRED_INPUT_ERROR })
  time: string;

  @ApiProperty()
  tags: string[] = [];

  @ApiProperty()
  @IsOptional()
  @IsPositive()
  income: number;

  @ApiProperty()
  @IsOptional()
  @IsPositive()
  outcome: number;
}
