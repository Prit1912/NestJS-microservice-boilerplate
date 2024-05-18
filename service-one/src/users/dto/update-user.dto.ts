import * as Joi from 'joi';

export const UpdateUserSchema = Joi.object({
  username: Joi.string(),
  age: Joi.number().min(16).max(200),
  mobile: Joi.string(),
  email: Joi.string().email(),
  createdBy: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  updatedBy: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  updatedAt: Joi.date(),
  createdAt: Joi.date(),
}).options({ abortEarly: true });
