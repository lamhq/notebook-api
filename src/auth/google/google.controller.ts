import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthService } from 'auth/auth.service';
import { AuthenticatedRequest } from 'auth/types/authenticated-request';
import { GoogleAuthGuard } from '../admin/guards/google-auth.guard';
import { Identity } from '../types/identity';

@ApiTags('Auth')
@Controller('auth/google')
export class GoogleController {
  constructor(private readonly authService: AuthService) {}

  @Post('access-tokens')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Get access token from google access token' })
  @ApiOkResponse({ type: Identity })
  @ApiUnauthorizedResponse({ description: 'Authentication failed.' })
  async getAccessToken(@Req() req: AuthenticatedRequest): Promise<Identity> {
    const token = this.authService.createIdentity(req.user);
    this.authService.setTokenCookie(req, token);
    return token;
  }
}
