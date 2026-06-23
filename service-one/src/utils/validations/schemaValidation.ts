import { BadRequestException } from '@nestjs/common';
import * as Joi from 'joi';

/** MongoDB ObjectId as a 24-char hex string (shared across DTO schemas). */
export const objectIdSchema = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

export const auditFieldsSchema = {
  createdBy: objectIdSchema,
  updatedBy: objectIdSchema,
  updatedAt: Joi.date(),
  createdAt: Joi.date(),
};

export const validateSchema = <T = unknown>(
  schema: Joi.Schema,
  object: unknown,
): T => {
  const { error, value } = schema.validate(object);
  if (error) {
    throw new BadRequestException(error.message);
  }
  return value as T;
};
