import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';
import { lastValueFrom } from 'rxjs';
import { customError } from '../errors/customError';

/**
 * Sends a command to a microservice and writes the result (or error) to the HTTP response.
 */
export async function proxyToMicroservice(
  client: ClientProxy,
  cmd: string,
  payload: Record<string, unknown> = {},
  response: Response,
) {
  try {
    const result = await lastValueFrom(client.send({ cmd }, payload));
    return response.send(result);
  } catch (error) {
    return customError(error, response);
  }
}
