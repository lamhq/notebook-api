import { ApiProperty } from '@nestjs/swagger';
import { Expose, Exclude, Transform } from 'class-transformer';
import { Entity, Column, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity({ name: 'settings' })
export class Setting {
  @ObjectIdColumn()
  @Transform((id) => id.toString())
  @Exclude()
  id: ObjectId;

  @ApiProperty({ example: 'contactEmail' })
  @Expose()
  @Column()
  key: string;

  @ApiProperty({ example: 'abc@example.com' })
  @Expose()
  @Column()
  value: string;

  constructor(partial: Partial<Setting>) {
    Object.assign(this, partial);
  }
}
