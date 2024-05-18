import * as Joi from 'joi';

export const CreatePostSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  author: Joi.string(),
  createdBy: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  updatedBy: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  updatedAt: Joi.date(),
  createdAt: Joi.date(),
}).options({ abortEarly: true });
