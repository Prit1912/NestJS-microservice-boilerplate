import * as Joi from 'joi';
import { auditFieldsSchema } from 'src/utils/validations/schemaValidation';

export const UserFieldsSchema = Joi.object({
  username: Joi.string(),
  age: Joi.number().min(16).max(200),
  mobile: Joi.string(),
  email: Joi.string().email(),
  ...auditFieldsSchema,
}).options({ abortEarly: true });

/** Create and update share the same field rules for this resource. */
export const CreateUserSchema = UserFieldsSchema;
export const UpdateUserSchema = UserFieldsSchema;
