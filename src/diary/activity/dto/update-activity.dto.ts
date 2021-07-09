import { IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateActivityDto {
  @ApiProperty()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  @IsNotEmpty()
  time: string;

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
