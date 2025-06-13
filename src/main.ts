import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config as envVarExtraction } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppConfigService } from './common/services';
import { CONFIG_PROVIDER_TOKEN } from './common/services/types';
import { MediaStorageService } from './media-storage/media-storage.service';
import { AppModule } from './app.module';
import packageJson from '../package.json';

async function bootstrap(): Promise<void> {
  envVarExtraction();

  const app = await NestFactory.create(AppModule);

  const config = app.get<AppConfigService>(CONFIG_PROVIDER_TOKEN);
  const mediaStorage = app.get<MediaStorageService>(MediaStorageService);
  await mediaStorage.init();
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, }));

  if (config.environment !== 'prod') {
    const swaggerOptions = new DocumentBuilder()
      .addBearerAuth()
      .setTitle(packageJson.name)
      .setDescription(packageJson.description)
      .setVersion(packageJson.version)
      .addServer(config.apiBaseUrl)
      .build();
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);
    SwaggerModule.setup('swagger', app, swaggerDocument);
  }

  await app.listen(config.appPort);
}
bootstrap();
