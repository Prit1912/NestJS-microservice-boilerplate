import { RpcException } from '@nestjs/microservices';

/** Runs an async operation and surfaces failures as RpcException for microservice callers. */
export async function handleRpc<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    throw new RpcException(error);
  }
}
