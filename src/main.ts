import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Groza API Gateway')
    .setDescription('The Groza delivery app API Gateway')
    .setVersion('1.0')
    .addTag('api-gateway')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const configService = app.get<ConfigService>(ConfigService);
  //Todo: Investigate Cors for production
  app.enableCors({
    allowedHeaders: ['content-type'],
    origin: configService.get('ALLOWED_ORIGINS'),
    credentials: true,
  });
  await app.listen(configService.get('API_PORT') ?? 3008);
}
bootstrap();
