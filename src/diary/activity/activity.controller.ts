import { Controller, Post, Body, UseGuards, Put } from '@nestjs/common';
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
import { UpdateActivityDto } from './dto/update-activity.dto';

@UseGuards(AdminJwtAuthGuard)
@Controller('diary/activities')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Invalid or missing access token' })
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  @ApiOperation({ summary: 'Add a new activity' })
  @ApiBody({ description: 'Activity data', type: AddActivityDto })
  @ApiOkResponse({ type: Activity })
  @ApiBadRequestResponse({ type: ErrorResponse, description: 'Input errors' })
  async addActivity(@Body() data: AddActivityDto): Promise<Activity> {
    return this.activityService.addActivity(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update post' })
  @ApiBody({ description: 'Activity data', type: UpdateActivityDto })
  @ApiOkResponse({ type: Activity })
  @ApiBadRequestResponse({ type: ErrorResponse, description: 'Input errors' })
  async updateActivity(id: string, @Body() data: UpdateActivityDto): Promise<Activity> {
    return this.activityService.updateActivity(id, data);
  }
}
