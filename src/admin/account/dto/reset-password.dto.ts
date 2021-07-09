import { Length, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty()
  @Length(6)
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  token: string;

  constructor(partial: Partial<ResetPasswordDto>) {
    Object.assign(this, partial);
  }
}
