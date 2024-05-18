import { Response } from 'express';
import { DEFAULT_FALLBACK_ERROR_STATUS_CODE } from '../constants/error';

export const customError = (error, response: Response) => {
  const updatedErrorResponse = {
    ...error,
    ...{ ...(!error?.errors ? { errors: {} } : {}) },
    ...{ ...(!error?.response ? { response: {} } : {}) },
    ...{
      ...(!error?.status ? { status: DEFAULT_FALLBACK_ERROR_STATUS_CODE } : {}),
    },
    ...{
      ...(error?.errorResponse?.errmsg
        ? { message: error?.errorResponse?.errmsg }
        : {}),
    },
  };
  const errorStatus =
    error?.status === 'error'
      ? DEFAULT_FALLBACK_ERROR_STATUS_CODE
      : error?.status;
  return response
    .status(errorStatus || DEFAULT_FALLBACK_ERROR_STATUS_CODE)
    .json(updatedErrorResponse);
};
