import { IsEmail, IsNotEmpty } from 'class-validator';
import { REQUIRED_INPUT_ERROR } from 'src/common/constants/error';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTokenDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty({ message: REQUIRED_INPUT_ERROR })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: REQUIRED_INPUT_ERROR })
  password: string;
}
