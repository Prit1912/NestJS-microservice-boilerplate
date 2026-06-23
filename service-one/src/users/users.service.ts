import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { handleRpc } from 'src/utils/rpc/handleRpc';
import { validateSchema } from 'src/utils/validations/schemaValidation';
import { CreateUserSchema, UpdateUserSchema } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  private async requireUser(userId: string) {
    const user = await this.userModel.findById(userId).exec();
    if (!user?._id) {
      throw new UnprocessableEntityException('User not found');
    }
    return user;
  }

  create(createUserData: unknown) {
    return handleRpc(async () => {
      validateSchema(CreateUserSchema, createUserData);
      return new this.userModel(createUserData).save();
    });
  }

  findAll() {
    return handleRpc(() => this.userModel.find().exec());
  }

  findOne(userId: string) {
    return handleRpc(() => this.requireUser(userId));
  }

  update(userId: string, data: unknown) {
    return handleRpc(async () => {
      validateSchema(UpdateUserSchema, data);
      const updatedUser = await this.userModel.findByIdAndUpdate(userId, data, {
        new: true,
      });
      if (!updatedUser?._id) {
        throw new UnprocessableEntityException('User not found');
      }
      return updatedUser;
    });
  }

  remove(userId: string) {
    return handleRpc(async () => {
      await this.userModel.findByIdAndDelete(userId);
      return 'User deleted';
    });
  }
}
