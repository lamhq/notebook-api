import { Controller, Req, Delete } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  @Delete('tokens/me')
  @ApiOperation({ summary: 'Logout' })
  logout(@Req() req: Request): void {
    req.res!.cookie('token', '', { expires: new Date(), httpOnly: true });
  }
}
