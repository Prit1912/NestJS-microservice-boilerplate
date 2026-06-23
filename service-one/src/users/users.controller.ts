import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: 'create-user' })
  @Post('create-user')
  create(@Body() payload: { body?: unknown }) {
    return this.usersService.create(payload?.body ?? {});
  }

  @MessagePattern({ cmd: 'get-all-users' })
  @Get('get-all-users')
  findAll() {
    return this.usersService.findAll();
  }

  @MessagePattern({ cmd: 'get-user-by-id' })
  @Get('get-user-by-id')
  findOne(@Body() payload: { id?: string }) {
    return this.usersService.findOne(payload?.id ?? '');
  }

  @MessagePattern({ cmd: 'update-user' })
  @Patch('update-user')
  update(@Body() payload: { id?: string; body?: unknown }) {
    return this.usersService.update(payload?.id ?? '', payload?.body ?? {});
  }

  @MessagePattern({ cmd: 'delete-user' })
  @Delete('delete-user')
  remove(@Body() payload: { id?: string }) {
    return this.usersService.remove(payload?.id ?? '');
  }
}
