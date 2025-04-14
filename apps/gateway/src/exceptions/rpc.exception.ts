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
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    // Obtener el error original
    const error: any = exception.getError();
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';

    console.log('RPC Error received:', error); // Añade esto para depuración

    // Manejar diferentes formatos de error
    if (typeof error === 'string') {
      message = error;
    } else if (typeof error === 'object' && error !== null) {
      // Para errores estándar de gRPC
      if (error.code !== undefined) {
        message = error.details || error.message || 'Error en microservicio';

        // Mapeo de códigos gRPC a HTTP
        switch (error.code) {
          case status.ALREADY_EXISTS:
            statusCode = HttpStatus.CONFLICT;
            break;
          case status.NOT_FOUND:
            statusCode = HttpStatus.NOT_FOUND;
            break;
          case status.INVALID_ARGUMENT:
            statusCode = HttpStatus.BAD_REQUEST;
            break;
          case status.PERMISSION_DENIED:
            statusCode = HttpStatus.FORBIDDEN;
            break;
          case status.UNAUTHENTICATED:
            statusCode = HttpStatus.UNAUTHORIZED;
            break;
          default:
            statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        }
      }
      // Para errores personalizados que podrían tener statusCode directamente
      else if (error.statusCode) {
        statusCode = error.statusCode;
        message = error.message || 'Error en microservicio';
      }
      // Para el objeto de error estándar de JavaScript
      else if (error.message) {
        message = error.message;
      }
    }

    response.status(statusCode).json({
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
