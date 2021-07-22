import { Controller, UseGuards, Get, Query, ParseArrayPipe, Header } from '@nestjs/common';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { AdminJwtAuthGuard } from 'auth/admin/jwt-auth.guard';
import { ParseDatePipe } from 'common/pipes/parse-date.pipe';
import { ActivityQuery } from '../activity/activity.entity';
import { Revenue } from './revenue.entity';
import { StatService } from './stat.service';

@UseGuards(AdminJwtAuthGuard)
@ApiTags('Diary')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Invalid or missing access token' })
@Controller('diary/stat')
export class StatController {
  constructor(private readonly statService: StatService) {}

  @Get('revenue')
  @Header('Cache-Control', 'no-store')
  @ApiOperation({ summary: 'Get revenue' })
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
  @ApiOkResponse({
    description: 'Revenue',
    type: Revenue,
    isArray: true,
  })
  async getRevenue(
    @Query('text') text?: string,
    @Query('tags', new ParseArrayPipe({ optional: true })) tags?: string[],
    @Query('from', ParseDatePipe) from?: Date,
    @Query('to', ParseDatePipe) to?: Date,
  ): Promise<Revenue> {
    const criteria: ActivityQuery = {
      text,
      tags,
      from,
      to,
    };
    return this.statService.getRevenue(criteria);
  }
}
