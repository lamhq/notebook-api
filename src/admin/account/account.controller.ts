import { Controller, Post, Body, Get, UseGuards, Patch, Put, Header } from '@nestjs/common';
import {
  ApiBody,
  ApiTags,
  ApiOperation,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ErrorResponse } from 'common/types/error-response';
import { UserId } from 'auth/user-id.decorator';
import { AdminJwtAuthGuard } from 'auth/admin/jwt-auth.guard';
import { Admin } from '../admin.entity';
import { AdminService } from '../admin.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('admin/accounts')
@ApiTags('Admin Account')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Invalid or missing access token' })
export class AdminAccountController {
  constructor(private readonly adminService: AdminService) {}

  @Get('me')
  @Header('Cache-Control', 'no-store')
  @UseGuards(AdminJwtAuthGuard)
  @ApiOperation({ summary: "Get admin account's details" })
  @ApiOkResponse({ type: Admin })
  async getAdminSetting(@UserId() userId: string): Promise<Admin | undefined> {
    return this.adminService.findOneByIdOrFail(userId);
  }

  @Post('me/password')
  @UseGuards(AdminJwtAuthGuard)
  @ApiOperation({ summary: 'Change password' })
  @ApiBody({ description: 'Change password data', type: ChangePasswordDto })
  @ApiBadRequestResponse({ type: ErrorResponse, description: 'Input errors' })
  async changePassword(@UserId() userId: string, @Body() data: ChangePasswordDto): Promise<void> {
    await this.adminService.changePassword(userId, data);
  }

  @Patch('me')
  @UseGuards(AdminJwtAuthGuard)
  @ApiOperation({ summary: 'Update profile' })
  @ApiOkResponse({ type: Admin })
  @ApiBadRequestResponse({ type: ErrorResponse, description: 'Input errors' })
  async updateProfile(@UserId() userId: string, @Body() data: UpdateProfileDto): Promise<void> {
    return this.adminService.updateProfile(userId, data);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password recovery via email' })
  @ApiBody({ description: 'Form data', type: ForgotPasswordDto })
  @ApiNotFoundResponse({ description: 'Email not found' })
  @ApiBadRequestResponse({ type: ErrorResponse, description: 'Input errors' })
  async requestResetPassword(@Body() data: ForgotPasswordDto): Promise<void> {
    return this.adminService.sendMailRequestResetPwd(data);
  }

  @Put('reset-password')
  @ApiOperation({ summary: 'Reset password' })
  @ApiBody({ description: 'Reset password data', type: ResetPasswordDto })
  @ApiBadRequestResponse({ type: ErrorResponse, description: 'Input errors' })
  async resetPassword(@Body() data: ResetPasswordDto): Promise<void> {
    return this.adminService.resetPassword(data);
  }
}
