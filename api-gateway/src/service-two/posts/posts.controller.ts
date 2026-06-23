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
import { MICROSERVICE_TWO_NAME } from 'src/utils/constants/microserviceNames';
import { proxyToMicroservice } from 'src/utils/microservice/proxy';

@Controller('posts')
export class PostsController {
  constructor(
    @Inject(MICROSERVICE_TWO_NAME) private readonly postsClient: ClientProxy,
  ) {}

  @Post()
  create(@Body() payload: unknown, @Response() response: ExpressResponse) {
    return proxyToMicroservice(
      this.postsClient,
      'create-post',
      { body: payload },
      response,
    );
  }

  @Get()
  findAll(@Response() response: ExpressResponse) {
    return proxyToMicroservice(
      this.postsClient,
      'get-all-posts',
      {},
      response,
    );
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Response() response: ExpressResponse,
  ) {
    return proxyToMicroservice(
      this.postsClient,
      'get-post-by-id',
      { id },
      response,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() payload: unknown,
    @Response() response: ExpressResponse,
  ) {
    return proxyToMicroservice(
      this.postsClient,
      'update-post',
      { id, body: payload },
      response,
    );
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Response() response: ExpressResponse,
  ) {
    return proxyToMicroservice(
      this.postsClient,
      'delete-post',
      { id },
      response,
    );
  }
}
