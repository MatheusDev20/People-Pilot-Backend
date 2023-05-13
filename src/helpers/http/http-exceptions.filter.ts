import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({
        response: exception.getResponse(),
        timestamp: new Date().toISOString(),
        path: request.url,
        // message: exception.message,
      });
    } else {
      response.status(500).json({
        statusCode: 500,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}
