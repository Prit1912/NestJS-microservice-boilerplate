import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @MessagePattern({ cmd: 'calling-from-service-one' })
  @Get()
  callingFromServiceOne(@Body() payload: { message?: string }) {
    return payload?.message ?? '';
  }

  @MessagePattern({ cmd: 'create-post' })
  @Post('create-post')
  create(@Body() payload: { body?: unknown }) {
    return this.postsService.create(payload?.body ?? {});
  }

  @MessagePattern({ cmd: 'get-all-posts' })
  @Get('get-all-posts')
  findAll() {
    return this.postsService.findAll();
  }

  @MessagePattern({ cmd: 'get-post-by-id' })
  @Get('get-post-by-id')
  findOne(@Body() payload: { id?: string }) {
    return this.postsService.findOne(payload?.id ?? '');
  }

  @MessagePattern({ cmd: 'update-post' })
  @Patch('update-post')
  update(@Body() payload: { id?: string; body?: unknown }) {
    return this.postsService.update(payload?.id ?? '', payload?.body ?? {});
  }

  @MessagePattern({ cmd: 'delete-post' })
  @Delete('delete-post')
  remove(@Body() payload: { id?: string }) {
    return this.postsService.remove(payload?.id ?? '');
  }
}
