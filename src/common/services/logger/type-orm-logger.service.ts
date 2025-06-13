import { Injectable } from '@nestjs/common';
import { Logger } from 'typeorm';

import { LoggerService } from './loger.service';

@Injectable()
export class TypeormLoggerService implements Logger {
  constructor(private loggerService: LoggerService) {
  }

  logQuery(query: string, parameters?: Array<unknown>): void {
    if (this.whiteListing(query)) {
      this.loggerService.debug('Start DB query', { query, parameters, });
    }
  }

  logQueryError(error: string, query: string, parameters?: Array<unknown>): void {
    this.loggerService.error('Failed DB query', error, { query, parameters, });
  }

  logQuerySlow(time: number, query: string, parameters?: Array<unknown>): void {
    this.loggerService.warn('Slow query took', { time: `${time} ms`, query, parameters, });
  }

  logSchemaBuild(message: string): void {
    this.loggerService.log(message);
  }

  logMigration(message: string): void {
    this.loggerService.log(message);
  }

  log(level: 'log' | 'info' | 'warn', message: string): void {
    switch (level) {
    case 'log':
      this.loggerService.log(message);
      break;
    case 'info':
      this.loggerService.log(message);
      break;
    case 'warn':
      this.loggerService.warn(message);
      break;
    }
  }

  private whiteListing(query: string): boolean {
    const whiteListSubstrings = [ 'SELECT', 'select', 'INSERT INTO', 'UPDATE', 'DELETE', ];
    return !!whiteListSubstrings.find(s => query.startsWith(s));
  }
}
