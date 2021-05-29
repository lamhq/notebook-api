import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { REQUIRED_INPUT_ERROR } from 'src/common/constants/error';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateActivityDto {
  @ApiProperty()
  @IsNotEmpty({ message: REQUIRED_INPUT_ERROR })
  content: string;

  @ApiProperty()
  @IsNotEmpty({ message: REQUIRED_INPUT_ERROR })
  createdAt: string;

  @ApiProperty()
  tags: string[] = [];

  @ApiProperty()
  @IsInt()
  @IsOptional()
  income: number;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  outcome: number;
}
