import { Controller, Post, Body, Get, UseGuards, Patch } from '@nestjs/common';
import {
  ApiBody,
  ApiTags,
  ApiOperation,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorResponse } from 'src/common/types/error-response';
import { AuthService } from 'src/auth/auth.service';
import { UserId } from 'src/auth/user-id.decorator';
import { AdminJwtAuthGuard } from 'src/auth/admin/jwt-auth.guard';
import { Admin } from '../admin.entity';
import { AdminService } from '../admin.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateAdminAccountDto } from './dto/update-admin-account.dto';

@Controller('admin/accounts')
@UseGuards(AdminJwtAuthGuard)
@ApiTags('Admin Account')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Invalid or missing access token' })
export class AdminAccountController {
  constructor(
    private readonly authService: AuthService,
    private readonly adminService: AdminService,
  ) {}

  @Get('me')
  @ApiOperation({ summary: "Get admin account's details" })
  @ApiOkResponse({ type: Admin })
  async getAdminSetting(@UserId() userId: string): Promise<Admin | undefined> {
    return this.adminService.findOneByIdOrFail(userId);
  }

  @Post('me/password')
  @ApiOperation({ summary: 'Change password' })
  @ApiBody({ description: 'Change password data', type: ChangePasswordDto })
  @ApiBadRequestResponse({ type: ErrorResponse, description: 'Input errors' })
  async changePassword(@UserId() userId: string, @Body() data: ChangePasswordDto): Promise<void> {
    await this.adminService.changePassword(userId, data);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiOkResponse({ type: Admin })
  @ApiBadRequestResponse({ type: ErrorResponse, description: 'Input errors' })
  async updateAdminSetting(
    @UserId() userId: string,
    @Body() data: UpdateAdminAccountDto,
  ): Promise<void> {
    return this.adminService.updateAdminSetting(userId, data);
  }
}
