import { Controller, UseGuards, Get, Query } from '@nestjs/common';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { AdminJwtAuthGuard } from 'src/auth/admin/jwt-auth.guard';
import { ParseDatePipe } from 'src/common/pipes/parse-date.pipe';
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
  @ApiOperation({ summary: 'Get revenue' })
  @ApiQuery({ name: 'from', required: false })
  @ApiQuery({ name: 'to', required: false })
  @ApiOkResponse({
    description: 'Revenue',
    type: Revenue,
    isArray: true,
  })
  async getRevenue(
    @Query('from', ParseDatePipe) from?: Date,
    @Query('to', ParseDatePipe) to?: Date,
  ): Promise<Revenue> {
    return this.statService.getRevenue(from, to);
  }
}
