import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { configFactory } from './config';
import { SystemModule } from './system/system.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { DiaryModule } from './diary/diary.module';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      // allow injecting ConfigService in module factory
      isGlobal: true,
      load: [configFactory],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const ormConfig = configService.get<TypeOrmModuleOptions>('typeorm');
        if (!ormConfig) {
          throw new Error('Invalid system configuration. TypeORM config is not set.');
        }
        return ormConfig;
      },
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const mailerOptions = configService.get<MailerOptions>('mail');
        if (!mailerOptions) {
          throw new Error('Invalid system configuration. Mail config is not set.');
        }
        return mailerOptions;
      },
    }),
    EventEmitterModule.forRoot({
      wildcard: true,
    }),
    SystemModule,
    AuthModule,
    AdminModule,
    DiaryModule,
  ],
})
export class AppModule {}
