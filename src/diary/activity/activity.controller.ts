import {
  Controller,
  Post,
  Body,
  UseGuards,
  Put,
  Delete,
  Param,
  Get,
  Req,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  ParseArrayPipe,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiBody,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AdminJwtAuthGuard } from 'src/auth/admin/jwt-auth.guard';
import { RES_HEADER_TOTAL_COUNT } from 'src/common/constants/pagination';
import { ParseDatePipe } from 'src/common/pipes/parse-date.pipe';
import { ErrorResponse } from 'src/common/types/error-response';
import { Activity, ActivityQuery } from './activity.entity';
import { ActivityService } from './activity.service';
import { AddActivityDto } from './dto/add-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@UseGuards(AdminJwtAuthGuard)
@Controller('diary/activities')
@ApiTags('Diary')
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

  @Get()
  @ApiOperation({ summary: 'Search activities' })
  @ApiQuery({
    required: false,
    name: 'tags',
    style: 'form',
    type: String,
    isArray: true,
    explode: false,
  })
  @ApiQuery({ name: 'text', required: false })
  @ApiQuery({ name: 'from', required: false })
  @ApiQuery({ name: 'to', required: false })
  @ApiQuery({ name: 'offset', required: false, type: Number, schema: { default: 0 } })
  @ApiQuery({ name: 'limit', required: false, type: Number, schema: { default: 10 } })
  @ApiOkResponse({
    description: 'Activity list',
    type: Activity,
    isArray: true,
    headers: {
      'X-Total-Count': {
        description: 'Total records without pagination',
        schema: { type: 'Number' },
      },
    },
  })
  async findAll(
    @Req() req: Request,
    @Query('text') text?: string,
    @Query('tags', new ParseArrayPipe({ optional: true })) tags?: string[],
    @Query('from', ParseDatePipe) from?: Date,
    @Query('to', ParseDatePipe) to?: Date,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset?: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit?: number,
  ): Promise<Activity[]> {
    const criteria: ActivityQuery = {
      text,
      offset,
      limit,
      tags,
      from,
      to,
    };
    const [result, total] = await this.activityService.findAll(criteria);
    req.res!.set(RES_HEADER_TOTAL_COUNT, total.toString());
    return result;
  }
}
