import { Logger, Injectable } from '@nestjs/common';

import { LogLevel } from '../../enums';
import { v4 } from 'uuid';
import { logglyLog } from './transports/loggly/loggly';
import { RequestMetadata } from '../index';

@Injectable()
export class LoggerService extends Logger {
  private requestId: string;

  private init(): void {
    const requestMetadata = RequestMetadata.getInstance();
    const { requestId, context, } = requestMetadata.metadata ?? { requestId: v4(), };
    if (context) {
      super.context = context;
      this.context = context;
    }
    this.requestId = requestId;
  }

  log(message: string, meta?: unknown): void {
    this.init();
    logglyLog({
      requestId: this.requestId,
      logMessage: message,
      context: this.context,
      data: meta,
      level: LogLevel.LOG,
    });
    super.log(JSON.stringify({ message, meta, requestId: this.requestId, }));
  }

  debug(message: string, meta?: unknown): void {
    this.init();
    logglyLog({
      logMessage: message,
      context: this.context,
      data: meta,
      requestId: this.requestId,
      level: LogLevel.DEBUG,
    });
    super.debug(JSON.stringify({ message, meta, requestId: this.requestId, }));
  }

  warn(message: string, meta?: unknown): void {
    this.init();
    logglyLog({
      logMessage: message,
      context: this.context,
      data: meta,
      requestId: this.requestId,
      level: LogLevel.WARN,
    });
    super.warn(JSON.stringify({ message, meta, requestId: this.requestId, }));
  }

  error(message: string, trace: unknown, meta?: unknown): void {
    this.init();
    logglyLog({
      logMessage: message,
      context: this.context,
      data: meta,
      level: LogLevel.ERROR,
      requestId: this.requestId,
      trace,
    });
    super.error(JSON.stringify({ message, meta, requestId: this.requestId, }), trace);
  }
}
