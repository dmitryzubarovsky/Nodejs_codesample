import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

import { LoggerService } from '../services';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) { }

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const messageLog = exception instanceof Error ?
      exception.message :
      'Unknown error!';

    const stackLog = exception instanceof Error ?
      exception.stack :
      'Unknown stack!';

    const statusCode =
      exception instanceof HttpException ?
        exception.getStatus() :
        HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException ?
        exception.getResponse():
        { statusCode, error: 'Internal Server Error', message: messageLog, };

    if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(messageLog, stackLog, { statusCode, error: stackLog, });
    } else {
      this.logger.warn(messageLog, { statusCode, error: stackLog, });
    }

    response.status(statusCode).json(message);
  }
}
