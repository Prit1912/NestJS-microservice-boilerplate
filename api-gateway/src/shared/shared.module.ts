import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  MICROSERVICE_ONE_NAME,
  MICROSERVICE_TWO_NAME,
} from 'src/utils/constants/microserviceNames';
require('dotenv').config();

const tcpClient = (name: string, portEnv: string) => ({
  name,
  transport: Transport.TCP as const,
  options: { port: Number(process.env[portEnv]) },
});

// Global so microservice clients can be injected without re-importing ClientsModule
@Global()
@Module({
  imports: [
    ClientsModule.register([
      tcpClient(MICROSERVICE_ONE_NAME, 'SERVICE_ONE_PORT'),
      tcpClient(MICROSERVICE_TWO_NAME, 'SERVICE_TWO_PORT'),
    ]),
  ],
  exports: [ClientsModule],
})
export class SharedModule {}
