import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { ObjectId } from 'mongodb';
import { Column, Entity, ObjectIdColumn } from 'typeorm';
import { PaginationQuery } from '../../common/types';

/**
 * The activity to be recorded
 */
@Entity({ name: 'activities' })
export class Activity {
  @ObjectIdColumn()
  @Transform((data) => (data.value as ObjectId).toString())
  @Expose()
  id: ObjectId;

  @Expose()
  @Column()
  @ApiProperty({ description: 'Content of the activity' })
  content?: string;

  /**
   * When the activity happen
   */
  @Expose()
  @Column()
  @ApiProperty({ description: 'When the activity happens' })
  time: Date;

  @Expose()
  @Column()
  @ApiProperty({ description: 'List of tags of the activity' })
  tags: string[] = [];

  /**
   * Amount of money get from the activity (k)
   */
  @Expose()
  @Column()
  @ApiProperty({ description: 'How much do i earn in this activity?' })
  income?: number;

  /**
   * Amount of money spent on the activity (k)
   */
  @Expose()
  @Column()
  @ApiProperty({ description: 'How much does it cost for the activity?' })
  outcome?: number;

  constructor(data: Partial<Activity>) {
    Object.assign(this, data);
  }
}

export interface ActivityQuery extends PaginationQuery {
  text?: string;
  tags?: string[];
  from?: Date;
  to?: Date;
}
