import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as mongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop()
  username: string;

  @Prop({ min: 16, max: 200 })
  age: number;

  @Prop()
  mobile: string;

  @Prop({
    type: String,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Regular expression for email validation
      'Please enter a valid email address', // Custom error message
    ],
  })
  email: string;

  @Prop({ type: mongooseSchema.Types.ObjectId })
  createdBy: mongooseSchema.Types.ObjectId;

  @Prop({ type: mongooseSchema.Types.ObjectId })
  updatedBy: mongooseSchema.Types.ObjectId;
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ username: 1 }, { unique: true, sparse: true });
UserSchema.index({ mobile: 1 }, { unique: true, sparse: true });
UserSchema.index({ email: 1 }, { unique: true, sparse: true });
UserSchema.index({ age: 1 });

// Hook example
UserSchema.pre('save', function (next) {
  console.log('User is about to be saved:', this);
  next();
});

// Virtual method exmaple
UserSchema.virtual('virtual_field').get(function () {
  return `${this.username} ${this.age}`;
});

// Instance method example
UserSchema.methods.getAge = function () {
  const now = new Date();
  const dob = new Date(this.dateOfBirth || '2000-12-19');
  const ageInYears = now.getFullYear() - dob.getFullYear();
  return ageInYears;
};

UserSchema.set('toJSON', { getters: true, virtuals: true });

export type UserDocument = HydratedDocument<User>;

export default UserSchema;
