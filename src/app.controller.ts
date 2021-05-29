import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@Controller()
@ApiTags('Health Check')
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Check API service is running' })
  getHello(): string {
    return `API is working. Version: ${process.env.npm_package_version}`;
  }
}
