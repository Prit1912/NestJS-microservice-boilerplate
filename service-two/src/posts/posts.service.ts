import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { handleRpc } from 'src/utils/rpc/handleRpc';
import { validateSchema } from 'src/utils/validations/schemaValidation';
import { CreatePostSchema, UpdatePostSchema } from './dto/create-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  private async requirePost(postId: string) {
    const post = await this.postModel.findById(postId).exec();
    if (!post?._id) {
      throw new UnprocessableEntityException('Post not found');
    }
    return post;
  }

  create(createPostData: unknown) {
    return handleRpc(async () => {
      validateSchema(CreatePostSchema, createPostData);
      return new this.postModel(createPostData).save();
    });
  }

  findAll() {
    return handleRpc(() => this.postModel.find().exec());
  }

  findOne(postId: string) {
    return handleRpc(() => this.requirePost(postId));
  }

  update(postId: string, data: unknown) {
    return handleRpc(async () => {
      validateSchema(UpdatePostSchema, data);
      const updatedPost = await this.postModel.findByIdAndUpdate(postId, data, {
        new: true,
      });
      if (!updatedPost?._id) {
        throw new UnprocessableEntityException('Post not found');
      }
      return updatedPost;
    });
  }

  remove(postId: string) {
    return handleRpc(async () => {
      await this.postModel.findByIdAndDelete(postId);
      return 'Post deleted';
    });
  }
}
