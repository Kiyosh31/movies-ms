import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';
import { status } from '@grpc/grpc-js';

@Catch(RpcException)
export class GrpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const error = exception.getError() as { code: number; message: string };
    let statusCode: HttpStatus;

    switch (error.code) {
      case status.NOT_FOUND:
        statusCode = HttpStatus.NOT_FOUND;
        break;
      case status.ALREADY_EXISTS:
        statusCode = HttpStatus.CONFLICT;
        break;
      case status.UNAUTHENTICATED:
        statusCode = HttpStatus.UNAUTHORIZED;
        break;
      case status.PERMISSION_DENIED:
        statusCode = HttpStatus.FORBIDDEN;
        break;
      case status.INVALID_ARGUMENT:
        statusCode = HttpStatus.BAD_REQUEST;
        break;
      default:
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        break;
    }

    response.status(statusCode).json({
      statusCode,
      message: error.message,
    });
  }
}
