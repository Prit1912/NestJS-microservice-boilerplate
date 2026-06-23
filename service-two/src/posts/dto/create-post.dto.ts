import * as Joi from 'joi';
import { auditFieldsSchema } from 'src/utils/validations/schemaValidation';

export const PostFieldsSchema = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  author: Joi.string(),
  ...auditFieldsSchema,
}).options({ abortEarly: true });

/** Create and update share the same field rules for this resource. */
export const CreatePostSchema = PostFieldsSchema;
export const UpdatePostSchema = PostFieldsSchema;
