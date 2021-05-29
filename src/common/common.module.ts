import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonService } from './common.service';
import { Counter } from './counter.entity';
import { PasswordValidator } from './is-password-match.decorator';

@Module({
  imports: [
    TypeOrmModule.forFeature([Counter]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('auth.secret');
        if (!secret) {
          throw new Error('Invalid system configiration. Authentication is not set.');
        }
        return {
          secret,
        };
      },
    }),
  ],
  providers: [CommonService, PasswordValidator],
  exports: [CommonService, PasswordValidator],
})
export class CommonModule {}
