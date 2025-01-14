import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ExceptionFilter } from './common/filters/exception.filter';
import { ValidateRequestBodyPipe } from './common/pipes/validate-request-body.pipe';

export async function getNestApp() {
  const app = await NestFactory.create(AppModule);

  // auto validate request body
  app.useGlobalPipes(new ValidateRequestBodyPipe());

  // handle exceptions and return error response to client
  app.useGlobalFilters(new ExceptionFilter());

  // auto generate API doc
  const config = new DocumentBuilder()
    .setTitle('Notebook API')
    .setDescription('API for Notebook app')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  return app;
}
