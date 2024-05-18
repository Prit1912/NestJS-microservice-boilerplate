import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @MessagePattern({ cmd: 'calling-from-service-one' })
  @Get()
  callingFromServiceOne(@Body() payload) {
    return payload.message || '';
  }

  @MessagePattern({ cmd: 'create-post' })
  @Post('create-post')
  async create(@Body() payload) {
    const postData = payload?.body || {};
    return await this.postsService.create(postData);
  }

  @MessagePattern({ cmd: 'get-all-posts' })
  @Get('get-all-posts')
  async findAll() {
    return await this.postsService.findAll();
  }

  @MessagePattern({ cmd: 'get-post-by-id' })
  @Get('get-post-by-id')
  async findOne(@Body() payload) {
    const { id = '' } = payload;
    return await this.postsService.findOne(id);
  }

  @MessagePattern({ cmd: 'update-post' })
  @Patch('update-post')
  async update(@Body() payload) {
    const { id = '', body = {} } = payload;
    return this.postsService.update(id, body);
  }

  @MessagePattern({ cmd: 'delete-post' })
  @Delete('delete-post')
  async remove(@Body() payload) {
    const { id = '' } = payload;
    return this.postsService.remove(id);
  }
}
