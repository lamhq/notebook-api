import { Controller, Post, UseGuards, Req } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AdminService } from 'src/admin/admin.service';
import { AuthService } from '../auth.service';
import { AdminLocalAuthGuard } from './local-auth.guard';
import { CreateTokenDto } from '../dto/create-token-dto';
import { UserId } from '../user-id.decorator';
import { Identity } from '../types/identity';

@ApiTags('Auth')
@Controller('auth/admin')
export class AdminAuthController {
  constructor(private readonly authService: AuthService, private adminService: AdminService) {}

  @UseGuards(AdminLocalAuthGuard)
  @Post('tokens')
  @ApiBody({ type: CreateTokenDto })
  @ApiOperation({ summary: 'Admin login' })
  @ApiOkResponse({ type: Identity })
  @ApiUnauthorizedResponse({ description: 'Authentication failed.' })
  async login(@Req() req: Request, @UserId() userId: string): Promise<Identity> {
    const admin = await this.adminService.findOneByIdOrFail(userId);
    const identity = this.authService.createIdentity({
      id: admin.id.toHexString(),
      displayName: admin.displayName || admin.email,
      email: admin.email,
      avatar: admin.avatar,
      roles: [],
    });
    req.res!.cookie('token', identity.token, { expires: identity.expireAt, httpOnly: true });
    return identity;
  }
}
