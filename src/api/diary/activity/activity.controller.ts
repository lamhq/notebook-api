import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { ObjectId } from 'mongodb';
import { RESP_HEADER_TOTAL_COUNT } from '../../common/constants/pagination';
import { ParseDatePipe } from '../../common/pipes/parse-date.pipe';
import { ParseObjectIDPipe } from '../../common/pipes/parse-object-id.pipe';
import { ErrorResponse, ValidationErrorResponse } from '../../common/types';
import { ActivityDto } from './activity.dto';
import { Activity, ActivityQuery } from './activity.entity';
import { ActivityService } from './activity.service';

@Controller('diary/activities')
@ApiTags('Diary')
@ApiUnauthorizedResponse({ description: 'Invalid or missing access token' })
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

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
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    schema: { default: 0 },
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    schema: { default: 10 },
  })
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
    req.res?.set(RESP_HEADER_TOTAL_COUNT, total.toString());
    return result;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get activity by Id' })
  @ApiOkResponse({ type: Activity })
  @ApiNotFoundResponse({ description: 'Activity not found', type: ErrorResponse })
  async findOne(@Param('id', ParseObjectIDPipe) id: ObjectId): Promise<Activity> {
    return this.activityService.findOneByIdOrFail(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete activity' })
  @ApiOkResponse({ description: 'Activity removed.' })
  @ApiNotFoundResponse({ description: 'Activity not found', type: ErrorResponse })
  async delete(@Param('id', ParseObjectIDPipe) id: ObjectId): Promise<void> {
    await this.activityService.delete(id);
  }

  @Post()
  @ApiOperation({ summary: 'Add a new activity' })
  @ApiBody({ description: 'Activity data', type: ActivityDto })
  @ApiOkResponse({ type: Activity })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    type: ValidationErrorResponse,
  })
  async create(@Body() data: ActivityDto): Promise<Activity> {
    return this.activityService.create(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update activity' })
  @ApiBody({ description: 'Activity data', type: ActivityDto })
  @ApiOkResponse({ type: Activity })
  @ApiNotFoundResponse({ description: 'Activity not found', type: ErrorResponse })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
    type: ValidationErrorResponse,
  })
  async update(
    @Param('id', ParseObjectIDPipe) id: ObjectId,
    @Body() data: ActivityDto,
  ): Promise<Activity> {
    return this.activityService.update(id, data);
  }
}
