import { IsEmail, IsNotEmpty } from 'class-validator';
import { REQUIRED_INPUT_ERROR } from 'src/common/constants/error';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty()
  @IsNotEmpty({ message: REQUIRED_INPUT_ERROR })
  @IsEmail()
  email: string;

  constructor(partial: Partial<ForgotPasswordDto>) {
    Object.assign(this, partial);
  }
}
