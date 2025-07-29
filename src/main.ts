import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { CommandFactory } from 'nest-commander';
import { ValidationPipe } from '@nestjs/common';
import { NOTIFYLY_QUEUE, RABBITMQ_URL } from './core/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [RABBITMQ_URL],
      queue: `${NOTIFYLY_QUEUE}`,
      queueOptions: { durable: true },
      prefetchCount: 1,
      wildcards: true,
    },
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Notifyly API')
    .setDescription('Notifyly API documentation')
    .setVersion('1.0')
    .addTag('Notifyly')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await CommandFactory.run(AppModule);
  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap()
  .then(() => {
    console.log(`Application is running on: ${process.env.PORT ?? 8081}`);
  })
  .catch((err) => {
    console.error('Error starting application:', err);
  });
