import { Expose, Exclude, Transform } from 'class-transformer';
import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ObjectIdColumn,
  Column,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';

@Entity({ name: 'administrators' })
export class Admin {
  @ObjectIdColumn()
  @Transform((data) => data.value.toString())
  @Expose()
  id: ObjectId;

  @Expose()
  @ApiProperty()
  @Column()
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Expose()
  @ApiProperty()
  @Column()
  avatar?: string;

  @Expose()
  @ApiProperty()
  @Column()
  displayName?: string;

  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn()
  deletedAt?: Date;

  constructor(partial: Partial<Admin>) {
    Object.assign(this, partial);
  }
}
