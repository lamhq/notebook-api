import { IsNotEmpty } from 'class-validator';
import { REQUIRED_INPUT_ERROR } from 'src/common/constants/error';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAdminAccountDto {
  @ApiProperty()
  @IsNotEmpty({ message: REQUIRED_INPUT_ERROR })
  displayName: string;

  @ApiProperty()
  avatar: string;

  constructor(partial: Partial<UpdateAdminAccountDto>) {
    Object.assign(this, partial);
  }
}
