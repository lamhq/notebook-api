import { Controller, Post, UseGuards, Req } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AdminService } from 'admin/admin.service';
import { TOKEN_COOKIE_NAME } from 'common/constants/auth';
import { AuthService } from '../auth.service';
import { AdminLocalAuthGuard } from './local-auth.guard';
import { CreateTokenDto } from '../dto/create-token-dto';
import { UserId } from '../user-id.decorator';
import { Identity } from '../types/identity';

@ApiTags('Auth')
@Controller('auth/admin')
export class AdminAuthController {
  constructor(private readonly authService: AuthService, private adminService: AdminService) {}

  @Post('tokens')
  @UseGuards(AdminLocalAuthGuard)
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
    req.res!.cookie(TOKEN_COOKIE_NAME, identity.token, {
      expires: identity.expireAt,
      httpOnly: true,
    });
    return identity;
  }
}
