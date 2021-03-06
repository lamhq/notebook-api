import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication, ClassSerializerInterceptor, ValidationError } from '@nestjs/common';
import { useContainer } from 'class-validator';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { InputErrorException } from './common/types/input-error.exception';
import { ObjectValidationPipe } from './common/pipes/object-validation-pipe';

function attachSwaggerModule(app: INestApplication) {
  const options = new DocumentBuilder()
    .setTitle('Notebook API')
    .setDescription('API of Notebook app')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/doc', app, document);
}

function attachValidationPipe(app: INestApplication) {
  app.useGlobalPipes(
    new ObjectValidationPipe({
      transform: true,
      skipMissingProperties: false,
      whitelist: false,
      forbidUnknownValues: true,
      disableErrorMessages: false,
      exceptionFactory: (errors: ValidationError[]) => {
        throw new InputErrorException(errors);
      },
    }),
  );
  // enable dependency injection for validator class
  useContainer(app.select(AppModule), { fallback: true, fallbackOnErrors: true });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  // enable class validation
  attachValidationPipe(app);

  // enable api documentation
  attachSwaggerModule(app);

  // enable transforming entity class to json
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get('Reflector')));

  // enable cookie parser
  app.use(cookieParser());

  // enable URI Versioning
  app.enableVersioning();

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
