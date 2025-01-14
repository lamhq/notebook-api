import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';

export class ActivityDto {
  @ApiProperty()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  @IsNotEmpty()
  time: string;

  @ApiProperty()
  @IsArray()
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
