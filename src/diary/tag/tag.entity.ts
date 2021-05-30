import { Expose, Transform } from 'class-transformer';
import { Entity, Column, ObjectIdColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';

@Entity({ name: 'tags' })
export class Tag {
  @ObjectIdColumn()
  @Transform((id) => id.toString())
  @Expose()
  id: ObjectId;

  @Expose()
  @ApiProperty()
  @Column()
  name: string;

  constructor(partial: Partial<Tag>) {
    Object.assign(this, partial);
  }
}
