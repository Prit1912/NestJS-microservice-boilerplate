import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Response,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response as ExpressResponse } from 'express';
import { MICROSERVICE_ONE_NAME } from 'src/utils/constants/microserviceNames';
import { proxyToMicroservice } from 'src/utils/microservice/proxy';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(MICROSERVICE_ONE_NAME) private readonly userClient: ClientProxy,
  ) {}

  @Post()
  createUser(@Body() payload: unknown, @Response() response: ExpressResponse) {
    return proxyToMicroservice(
      this.userClient,
      'create-user',
      { body: payload },
      response,
    );
  }

  @Get()
  getAllUsers(@Response() response: ExpressResponse) {
    return proxyToMicroservice(this.userClient, 'get-all-users', {}, response);
  }

  @Get(':id')
  getUserById(
    @Param('id') id: string,
    @Response() response: ExpressResponse,
  ) {
    return proxyToMicroservice(
      this.userClient,
      'get-user-by-id',
      { id },
      response,
    );
  }

  @Patch(':id')
  updateUser(
    @Param('id') id: string,
    @Body() payload: unknown,
    @Response() response: ExpressResponse,
  ) {
    return proxyToMicroservice(
      this.userClient,
      'update-user',
      { id, body: payload },
      response,
    );
  }

  @Delete(':id')
  deleteUser(
    @Param('id') id: string,
    @Response() response: ExpressResponse,
  ) {
    return proxyToMicroservice(
      this.userClient,
      'delete-user',
      { id },
      response,
    );
  }
}
