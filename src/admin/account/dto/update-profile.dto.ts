import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty()
  @IsNotEmpty()
  displayName: string;

  @ApiProperty()
  avatar: string;

  constructor(partial: Partial<UpdateProfileDto>) {
    Object.assign(this, partial);
  }
}
