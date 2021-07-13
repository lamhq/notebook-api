import { Controller, UseGuards, Get, Header } from '@nestjs/common';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminJwtAuthGuard } from 'src/auth/admin/jwt-auth.guard';
import { TagService } from './tag.service';

@UseGuards(AdminJwtAuthGuard)
@Controller('diary/tags')
@ApiTags('Diary')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Invalid or missing access token' })
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @Header('Cache-Control', 'no-store')
  @ApiOperation({ summary: 'Get all tags' })
  @ApiOkResponse({
    description: 'Tag list',
    type: String,
    isArray: true,
  })
  async findAll(): Promise<string[]> {
    return this.tagService.findAllTagNames();
  }
}
