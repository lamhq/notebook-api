import { Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UploadToken } from './upload-params';
import { UploadService } from './upload.service';

@Controller('system/upload')
@ApiTags('System')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('tokens')
  @ApiOperation({ summary: 'Get upload token' })
  @ApiOkResponse({ description: 'Upload token', type: UploadToken })
  getUploadToken(): UploadToken {
    return this.uploadService.getUploadToken();
  }
}
