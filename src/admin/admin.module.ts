import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'common/common.module';
import { AdminService } from './admin.service';
import { Admin } from './admin.entity';
import { AdminAccountController } from './account/account.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Admin]), CommonModule],
  controllers: [AdminAccountController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
