import { Controller, Post, Body, UseGuards, Put, Delete, Param } from '@nestjs/common';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiBody,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
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
  @ApiNotFoundResponse({ description: 'Activity not found' })
  @ApiBadRequestResponse({ type: ErrorResponse, description: 'Input errors' })
  async updateActivity(
    @Param('id') id: string,
    @Body() data: UpdateActivityDto,
  ): Promise<Activity> {
    return this.activityService.updateActivity(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete activity' })
  @ApiOkResponse({ description: 'Activity removed.' })
  @ApiNotFoundResponse({ description: 'Activity not found' })
  async deleteActivity(@Param('id') id: string): Promise<void> {
    await this.activityService.deleteActivity(id);
  }
}
