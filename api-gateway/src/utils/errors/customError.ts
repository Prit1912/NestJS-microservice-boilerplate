import { Response } from 'express';
import { DEFAULT_FALLBACK_ERROR_STATUS_CODE } from '../constants/error';

export const customError = (error: any, response: Response) => {
  const status =
    !error?.status || error.status === 'error'
      ? DEFAULT_FALLBACK_ERROR_STATUS_CODE
      : error.status;

  const body = {
    ...error,
    errors: error?.errors ?? {},
    response: error?.response ?? {},
    status,
    ...(error?.errorResponse?.errmsg
      ? { message: error.errorResponse.errmsg }
      : {}),
  };

  return response.status(status).json(body);
};
