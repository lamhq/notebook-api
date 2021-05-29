import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { CommonModule } from 'src/common/common.module';
import { AdminModule } from 'src/admin/admin.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AdminLocalAuthGuard } from './admin/local-auth.guard';
import { AdminLocalAuthStrategy } from './admin/local-auth.strategy';
import { AdminJwtAuthGuard } from './admin/jwt-auth.guard';
import { AdminJwtAuthStrategy } from './admin/jwt-auth.strategy';
import { AdminAuthController } from './admin/auth.controller';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const duration = configService.get<string>('auth.accessTokenLifetime');
        const secret = configService.get<string>('auth.secret');
        if (!duration || !secret) {
          throw new Error('Invalid system configiration. Authentication is not set.');
        }
        return {
          secret,
          signOptions: { expiresIn: duration },
        };
      },
    }),
    CommonModule,
    AdminModule,
  ],
  providers: [
    AuthService,
    AdminLocalAuthGuard,
    AdminLocalAuthStrategy,
    AdminJwtAuthGuard,
    AdminJwtAuthStrategy,
  ],
  controllers: [AuthController, AdminAuthController],
  exports: [AuthService],
})
export class AuthModule {}
