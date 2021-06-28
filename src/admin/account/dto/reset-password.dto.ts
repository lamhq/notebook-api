import { Length, IsNotEmpty } from 'class-validator';
import { LENGTH_INPUT_ERROR, REQUIRED_INPUT_ERROR } from 'src/common/constants/error';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty()
  @Length(6, undefined, { message: LENGTH_INPUT_ERROR })
  @IsNotEmpty({ message: REQUIRED_INPUT_ERROR })
  password: string;

  @ApiProperty()
  @IsNotEmpty({ message: REQUIRED_INPUT_ERROR })
  token: string;

  constructor(partial: Partial<ResetPasswordDto>) {
    Object.assign(this, partial);
  }
}
