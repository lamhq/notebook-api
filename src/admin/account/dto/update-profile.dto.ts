import { IsNotEmpty } from 'class-validator';
import { REQUIRED_INPUT_ERROR } from 'src/common/constants/error';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty()
  @IsNotEmpty({ message: REQUIRED_INPUT_ERROR })
  displayName: string;

  @ApiProperty()
  avatar: string;

  constructor(partial: Partial<UpdateProfileDto>) {
    Object.assign(this, partial);
  }
}
