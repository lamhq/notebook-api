import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UploadToken {
  @Expose()
  @ApiProperty()
  uploadUrl: string;

  @Expose()
  @ApiProperty()
  fileUrl: string;

  @Expose()
  @ApiProperty()
  key: string;

  @Expose()
  @ApiProperty()
  acl: string;

  @Expose()
  @ApiProperty()
  successActionStatus: string;

  @Expose()
  @ApiProperty()
  policy: string;

  @Expose()
  @ApiProperty()
  signature: string;

  @Expose()
  @ApiProperty()
  credential: string;

  @Expose()
  @ApiProperty()
  date: string;

  @Expose()
  @ApiProperty()
  algorithm: string;

  constructor(partial: Partial<UploadToken>) {
    Object.assign(this, partial);
  }
}
