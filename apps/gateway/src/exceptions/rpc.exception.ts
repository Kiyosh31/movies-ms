// @ts-nocheck
import { status } from '@grpc/grpc-js';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

@Catch(RpcException)
export class GlobalRpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const error = exception.getError();
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorMessage = 'Internal Server Error';

    if (error) {
      if (typeof error === 'object' && error !== null) {
        switch (error.code) {
          case status.NOT_FOUND: // Numeric value of NOT_FOUND (typically 5)
            statusCode = HttpStatus.NOT_FOUND;
            errorMessage = error.details || 'Resource not found';
            break;
          case status.ALREADY_EXISTS: // Numeric value of NOT_FOUND (typically 5)
            statusCode = HttpStatus.ALREADY_REPORTED;
            errorMessage = error.details || 'Resource already exists';
            break;
          case status.INVALID_ARGUMENT: // Numeric value of INVALID_ARGUMENT (typically 3)
            statusCode = HttpStatus.BAD_REQUEST;
            errorMessage = error.details || 'Invalid input';
            break;
          case status.PERMISSION_DENIED: // Numeric value of INVALID_ARGUMENT (typically 3)
            statusCode = HttpStatus.UNAUTHORIZED;
            errorMessage = error.details || 'Unauthorized';
            break;
          default:
            statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            errorMessage =
              error.details ||
              error.message ||
              'Internal Server Error from Microservice';
            break;
        }
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
    } else {
      errorMessage = exception.message || 'An unexpected error occurred.';
    }

    response.status(statusCode).json({
      statusCode,
      message: errorMessage,
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
    });
  }
}
