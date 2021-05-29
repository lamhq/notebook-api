import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiBody,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { AdminJwtAuthGuard } from 'src/auth/admin/jwt-auth.guard';
import { ErrorResponse } from 'src/common/types/error-response';
import { Activity } from './activity.entity';
import { ActivityService } from './activity.service';
import { AddActivityDto } from './dto/add-activity.dto';

@Controller('diary/activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  @UseGuards(AdminJwtAuthGuard)
  @ApiOperation({ summary: 'Add a new activity' })
  @ApiBearerAuth()
  @ApiBody({ description: 'Activity data', type: AddActivityDto })
  @ApiOkResponse({ type: Activity })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing access token' })
  @ApiBadRequestResponse({ type: ErrorResponse, description: 'Input errors' })
  async addActivity(@Body() data: AddActivityDto): Promise<Activity> {
    return this.activityService.addActivity(data);
  }
}
