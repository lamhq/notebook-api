import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';
import { LENGTH_INPUT_ERROR, REQUIRED_INPUT_ERROR } from 'src/common/constants/error';

export class ChangePasswordDto {
  @ApiProperty()
  @Length(6, undefined, { message: LENGTH_INPUT_ERROR })
  @IsNotEmpty({ message: REQUIRED_INPUT_ERROR })
  currentPassword: string;

  @ApiProperty()
  @Length(6, undefined, { message: LENGTH_INPUT_ERROR })
  @IsNotEmpty({ message: REQUIRED_INPUT_ERROR })
  newPassword: string;
}
