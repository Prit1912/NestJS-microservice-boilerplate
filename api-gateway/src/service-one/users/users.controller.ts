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
import { lastValueFrom } from 'rxjs';
import { MICROSERVICE_ONE_NAME } from 'src/utils/constants/microserviceNames';
import { customError } from 'src/utils/errors/customError';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(MICROSERVICE_ONE_NAME) private readonly userClient: ClientProxy,
  ) {}

  @Post()
  async createUser(@Body() payload, @Response() response) {
    try {
      const result = await lastValueFrom(
        this.userClient.send({ cmd: 'create-user' }, { body: payload }),
      );
      return response.send(result);
    } catch (error) {
      return customError(error, response);
    }
  }

  @Get()
  async getAllUsers(@Response() response) {
    try {
      const result = await lastValueFrom(
        this.userClient.send({ cmd: 'get-all-users' }, {}),
      );
      return response.send(result);
    } catch (error) {
      return customError(error, response);
    }
  }

  @Get(':id')
  async getUserById(@Param('id') id: string, @Response() response) {
    try {
      const result = await lastValueFrom(
        this.userClient.send({ cmd: 'get-user-by-id' }, { id }),
      );
      return response.send(result);
    } catch (error) {
      return customError(error, response);
    }
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() payload,
    @Response() response,
  ) {
    try {
      const result = await lastValueFrom(
        this.userClient.send({ cmd: 'update-user' }, { id, body: payload }),
      );
      return response.send(result);
    } catch (error) {
      return customError(error, response);
    }
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Response() response) {
    try {
      const result = await lastValueFrom(
        this.userClient.send({ cmd: 'delete-user' }, { id }),
      );
      return response.send(result);
    } catch (error) {
      return customError(error, response);
    }
  }
}
