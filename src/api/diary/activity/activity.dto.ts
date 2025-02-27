import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumberString,
  ValidateIf,
} from 'class-validator';
import { Activity } from './activity.entity';

export class ActivityDto {
  @ApiProperty()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  time: string;

  @ApiProperty()
  @IsArray()
  tags: string[] = [];

  @ApiProperty()
  @ValidateIf((o: ActivityDto) => Boolean(o.income))
  @IsNumberString()
  income?: string;

  @ApiProperty()
  @ValidateIf((o: ActivityDto) => Boolean(o.outcome))
  @IsNumberString()
  outcome?: string;

  toActivity(): Activity {
    const result = new Activity({
      content: this.content,
      time: new Date(this.time),
      tags: this.tags.map((tag) => tag.toLowerCase().trim()),
    });
    if (this.income) result.income = parseInt(this.income);
    if (this.outcome) result.outcome = parseInt(this.outcome);
    return result;
  }
}
