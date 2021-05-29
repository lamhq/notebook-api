import { Expose, Transform } from 'class-transformer';
import { Entity, Column, ObjectIdColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';

@Entity({ name: 'activities' })
export class Activity {
  @ObjectIdColumn()
  @Transform((id) => id.toString())
  @Expose()
  id: ObjectId;

  @Expose()
  @ApiProperty()
  @Column()
  content: string;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  tags: string[] = [];

  @Expose()
  @ApiProperty()
  income: number;

  @Expose()
  @ApiProperty()
  outcome: number;

  constructor(partial: Partial<Activity>) {
    Object.assign(this, partial);
  }
}
