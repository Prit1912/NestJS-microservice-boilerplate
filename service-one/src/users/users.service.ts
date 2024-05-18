import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { validateSchema } from 'src/utils/validations/schemaValidation';
import { CreateUserSchema } from './dto/create-user.dto';
import {
  ClientProxy,
  ClientProxyFactory,
  RpcException,
  Transport,
} from '@nestjs/microservices';
import { UpdateUserSchema } from './dto/update-user.dto';
require('dotenv').config();

const SERVICE_TWO_TCP_PORT = Number(process.env.SERVICE_TWO_TCP_PORT);
const SERVICE_TWO_TCP_HOST = process.env.SERVICE_TWO_TCP_HOST;

@Injectable()
export class UsersService {
  private serviceTwoClient: ClientProxy;

  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    this.serviceTwoClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        port: SERVICE_TWO_TCP_PORT,
        host: SERVICE_TWO_TCP_HOST,
      },
    });
  }

  async create(createUserData) {
    try {
      validateSchema(CreateUserSchema, createUserData);
      const createdUser: any = new this.userModel(createUserData);
      //  Instance method example
      // console.log(createdUser.getAge());

      const user = await createdUser.save();

      // set user in redis
      // this.redisService.set(user.id, user);
      // this.redisService.setWithExpiry(user.id, user, 50); // stores for 50 sec
      return user;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async findAll() {
    try {
      // Call another service from this service
      // return this.serviceTwoClient.send(
      //   { cmd: 'calling-from-service-one' },
      //   { message: 'Calling from service one' },
      // );
      return await this.userModel.find().exec();
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async findOne(userId) {
    try {
      // get user from redis
      // const redisUser = await this.redisService.get(userId);
      // console.log(redisUser);
      const user = await this.userModel.findById(userId).exec();
      if (!user?._id) {
        throw new UnprocessableEntityException('User not found');
      }
      return user;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async update(userId: string, data: any) {
    try {
      validateSchema(UpdateUserSchema, data);
      const updatedUser = await this.userModel.findByIdAndUpdate(userId, data, {
        new: true,
      });
      if (!updatedUser?._id) {
        throw new UnprocessableEntityException('User not found');
      }
      return updatedUser;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async remove(userId) {
    try {
      await this.userModel.findByIdAndDelete(userId);
      return 'User deleted';
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
