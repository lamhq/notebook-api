import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { configFactory } from './config';
import { DiaryModule } from './diary/diary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // allow injecting ConfigService in module factory
      load: [configFactory],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const typeormConfig = configService.get<TypeOrmModuleOptions>('typeorm');
        if (!typeormConfig) {
          throw new Error(
            'Invalid system configuration. TypeORM config is not set.',
          );
        }
        return typeormConfig;
      },
    }),
    EventEmitterModule.forRoot({
      wildcard: true,
    }),
    DiaryModule,
  ],
})
export class AppModule {}
