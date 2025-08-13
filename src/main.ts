import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Apply validation globally
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  //Allow query objects
  app.set('query parser', 'extended');

  // Enable versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  //Set Global Prefix
  app.setGlobalPrefix('api');

  // Set up Swagger
  const config = new DocumentBuilder()
    .setTitle('Job Service')
    .setDescription(
      'API for aggregating and searching job offers from multiple sources',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
