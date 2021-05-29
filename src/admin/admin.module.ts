import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/auth/auth.module';
import { AdminService } from './admin.service';
import { Admin } from './admin.entity';
import { AdminAccountController } from './account/account.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Admin]), CommonModule, forwardRef(() => AuthModule)],
  controllers: [AdminAccountController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
