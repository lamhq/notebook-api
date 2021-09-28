import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from 'auth/auth.service';
import { AuthenticatedRequest } from 'auth/types/authenticated-request';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { Identity } from '../types/identity';

@ApiTags('Auth')
@Controller('auth/google')
export class GoogleController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Perform Google Login' })
  login() {
    return 'success';
  }

  @Post('access-tokens')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Get access token from google auth params' })
  @ApiQuery({
    name: 'code',
    required: true,
    description: 'Value retrieve from google callback url',
  })
  @ApiQuery({
    name: 'scope',
    required: true,
    description: 'Value retrieve from google callback url',
  })
  @ApiQuery({
    name: 'authuser',
    required: true,
    description: 'Value retrieve from google callback url',
  })
  @ApiQuery({
    name: 'prompt',
    required: true,
    description: 'Value retrieve from google callback url',
  })
  @ApiOkResponse({ type: Identity })
  @ApiUnauthorizedResponse({ description: 'Authentication failed.' })
  async getAccessToken(@Req() req: AuthenticatedRequest): Promise<Identity> {
    const token = this.authService.createIdentity(req.user);
    this.authService.setTokenCookie(req, token);
    return token;
  }
}
