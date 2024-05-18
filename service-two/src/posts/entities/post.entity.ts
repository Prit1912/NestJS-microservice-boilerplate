import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as mongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Post {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop({ type: mongooseSchema.Types.ObjectId })
  author: string;

  @Prop({ type: mongooseSchema.Types.ObjectId })
  createdBy: mongooseSchema.Types.ObjectId;

  @Prop({ type: mongooseSchema.Types.ObjectId })
  updatedBy: mongooseSchema.Types.ObjectId;
}

const PostSchema = SchemaFactory.createForClass(Post);

export type PostDocument = HydratedDocument<Post>;

export default PostSchema;
