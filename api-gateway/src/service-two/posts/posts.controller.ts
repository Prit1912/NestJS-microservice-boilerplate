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
import { MICROSERVICE_TWO_NAME } from 'src/utils/constants/microserviceNames';
import { customError } from 'src/utils/errors/customError';

@Controller('posts')
export class PostsController {
  constructor(
    @Inject(MICROSERVICE_TWO_NAME) private readonly userClient: ClientProxy,
  ) {}

  @Post()
  async create(@Body() payload, @Response() response) {
    try {
      const result = await lastValueFrom(
        this.userClient.send({ cmd: 'create-post' }, { body: payload }),
      );
      return response.send(result);
    } catch (error) {
      return customError(error, response);
    }
  }

  @Get()
  async findAll(@Response() response) {
    try {
      const result = await lastValueFrom(
        this.userClient.send({ cmd: 'get-all-posts' }, {}),
      );
      return response.send(result);
    } catch (error) {
      return customError(error, response);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Response() response) {
    try {
      const result = await lastValueFrom(
        this.userClient.send({ cmd: 'get-post-by-id' }, { id }),
      );
      return response.send(result);
    } catch (error) {
      return customError(error, response);
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() payload, @Response() response) {
    try {
      const result = await lastValueFrom(
        this.userClient.send({ cmd: 'update-post' }, { id, body: payload }),
      );
      return response.send(result);
    } catch (error) {
      return customError(error, response);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Response() response) {
    try {
      const result = await lastValueFrom(
        this.userClient.send({ cmd: 'delete-post' }, { id }),
      );
      return response.send(result);
    } catch (error) {
      return customError(error, response);
    }
  }
}
