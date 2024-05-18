import { Controller, Get, Post, Body, Patch, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
require('dotenv').config();

@Controller('users')
export class UsersController {
  private serviceTwoClient: ClientProxy;

  constructor(private readonly usersService: UsersService) {}

  @MessagePattern({ cmd: 'create-user' })
  @Post('create-user')
  async create(@Body() payload) {
    const userData = payload?.body || {};
    return await this.usersService.create(userData);
  }

  @MessagePattern({ cmd: 'get-all-users' })
  @Get('get-all-users')
  async findAll() {
    return await this.usersService.findAll();
  }

  @MessagePattern({ cmd: 'get-user-by-id' })
  @Get('get-user-by-id')
  async findOne(@Body() payload) {
    const { id = '' } = payload;
    return await this.usersService.findOne(id);
  }

  @MessagePattern({ cmd: 'update-user' })
  @Patch('update-user')
  async update(@Body() payload) {
    const { id = '', body = {} } = payload;
    return this.usersService.update(id, body);
  }

  @MessagePattern({ cmd: 'delete-user' })
  @Delete('delete-user')
  async remove(@Body() payload) {
    const { id = '' } = payload;
    return this.usersService.remove(id);
  }
}
