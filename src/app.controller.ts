import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@Controller({ version: VERSION_NEUTRAL })
@ApiTags('Health Check')
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Check API service is running' })
  getHello(): string {
    return `API is working. Version: ${process.env.npm_package_version}`;
  }
}
