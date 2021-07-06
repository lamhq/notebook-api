import { Expose, Transform } from 'class-transformer';
import { Entity, Column, ObjectIdColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { PaginationQuery } from 'src/common/types/pagination-query';

@Entity({ name: 'activities' })
export class Activity {
  @ObjectIdColumn()
  @Transform((id) => id.toString())
  @Expose()
  id: ObjectId;

  @Expose()
  @ApiProperty({ description: 'Content of the activity' })
  @Column()
  content: string;

  @Expose()
  @ApiProperty({ description: 'When the activity happens' })
  @Column()
  time: Date;

  @Expose()
  @ApiProperty({ description: 'List of tags of the activity' })
  @Column()
  tags: string[] = [];

  @Expose()
  @ApiProperty({ description: 'How much do i earn for the activity?' })
  @Column()
  income: number;

  @Expose()
  @ApiProperty({ description: 'How much does it cost for the activity?' })
  @Column()
  outcome: number;

  constructor(partial: Partial<Activity>) {
    Object.assign(this, partial);
  }
}

export interface ActivityQuery extends PaginationQuery {
  text?: string;
  tags?: string[];
  from?: Date;
  to?: Date;
}
