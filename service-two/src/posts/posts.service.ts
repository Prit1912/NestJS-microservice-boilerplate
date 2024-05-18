import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './entities/post.entity';
import { Model } from 'mongoose';
import { validateSchema } from 'src/utils/validations/schemaValidation';
import { CreatePostSchema } from './dto/create-post.dto';
import { UpdatePostSchema } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>, // @Inject(CACHE_MANAGER) private cacheManager: Cache, // This is also a way to store data in redis directly // private redisService: RedisService, // Need to update test cases after enabling it
  ) {}

  async create(createPostData) {
    try {
      validateSchema(CreatePostSchema, createPostData);
      const createdPost: any = new this.postModel(createPostData);
      const post = await createdPost.save();
      return post;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async findAll() {
    try {
      return await this.postModel.find().exec();
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async findOne(postId) {
    try {
      const post = await this.postModel.findById(postId).exec();
      if (!post?._id) {
        throw new UnprocessableEntityException('Post not found');
      }
      return post;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async update(postId: string, data: any) {
    try {
      validateSchema(UpdatePostSchema, data);
      const updatedPost = await this.postModel.findByIdAndUpdate(postId, data, {
        new: true,
      });
      if (!updatedPost?._id) {
        throw new UnprocessableEntityException('Post not found');
      }
      return updatedPost;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async remove(postId) {
    try {
      await this.postModel.findByIdAndDelete(postId);
      return 'Post deleted';
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
