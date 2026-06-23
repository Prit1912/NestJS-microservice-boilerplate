import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice(
    {
      transport: Transport.TCP,
      options: { port: Number(process.env.SERVICE_TWO_TCP_PORT) },
    },
    { inheritAppConfig: true },
  );
  await app.startAllMicroservices();
  await app.listen(Number(process.env.PORT));
}
bootstrap();
