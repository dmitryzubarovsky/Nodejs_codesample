import { LogLevel } from '../../../../enums';

export interface ILogglyMessage {
  requestId: string;
  logMessage: string;
  context: string;
  data: unknown;
  level: LogLevel;
  trace?: unknown;
}
