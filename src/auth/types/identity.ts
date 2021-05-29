import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class Identity {
  @Expose()
  @ApiProperty()
  displayName: string;

  @Expose()
  @ApiProperty()
  avatar?: string;

  @Expose()
  @ApiProperty()
  email: string;

  @Expose()
  @ApiProperty()
  roles?: string[];

  @Expose()
  @ApiProperty()
  token: string;

  @Expose()
  @ApiProperty()
  expireAt: Date;

  @Expose()
  @ApiProperty()
  id: string;

  constructor(partial: Partial<Identity>) {
    Object.assign(this, partial);
  }
}
