import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
require('dotenv').config();

// This is the port defined in API gateway to interact with service one
const SERVICE_TWO_TCP_PORT = Number(process.env.SERVICE_TWO_TCP_PORT);

// Port if you want to run service saperately on different port
const SERVICE_TWO_PORT = Number(process.env.PORT);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice(
    {
      transport: Transport.TCP,
      options: {
        port: SERVICE_TWO_TCP_PORT,
      },
    },
    { inheritAppConfig: true },
  );
  await app.startAllMicroservices();
  await app.listen(SERVICE_TWO_PORT);
}
bootstrap();
