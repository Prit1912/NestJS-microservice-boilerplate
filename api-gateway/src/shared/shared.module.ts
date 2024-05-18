import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  MICROSERVICE_ONE_NAME,
  MICROSERVICE_TWO_NAME,
} from 'src/utils/constants/microserviceNames';
require('dotenv').config();

// Port through which we will interact with service one
const SERVICE_ONE_PORT = Number(process.env.SERVICE_ONE_PORT);

// Port through which we will interact with service two
const SERVICE_TWO_PORT = Number(process.env.SERVICE_TWO_PORT);

// Declaring this module globally so we do not need to import in every module to inject service one and service two
@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: MICROSERVICE_ONE_NAME,
        transport: Transport.TCP,
        options: { port: SERVICE_ONE_PORT },
      },
      {
        name: MICROSERVICE_TWO_NAME,
        transport: Transport.TCP,
        options: { port: SERVICE_TWO_PORT },
      },
    ]),
  ],
  exports: [ClientsModule],
})
export class SharedModule {}
