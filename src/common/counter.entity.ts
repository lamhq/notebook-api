import { Entity, Column, ObjectIdColumn, CreateDateColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

export enum CodeType {
  Product = 'PRODUCT',
  Order = 'ORDER',
  Default = 'DEFAULT',
  Category = 'CATEGORY',
}

@Entity({ name: 'counters' })
export class Counter {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  type: CodeType;

  @Column()
  value: number;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
