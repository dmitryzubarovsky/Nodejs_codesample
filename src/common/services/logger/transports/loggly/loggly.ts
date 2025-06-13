import { parse } from 'stacktrace-parser';

import { LogglyClient } from './loggly-client';
import { ILogglyMessage } from './loggly-message.interface';

function prepareMessage(logglyMessage: ILogglyMessage): ILogglyMessage {
  const prefix = logglyMessage.context ? `[${logglyMessage.context}] ` : '';
  logglyMessage.logMessage = prefix + logglyMessage.logMessage;
  return logglyMessage;
}

function prepareTrace(logglyMessage: ILogglyMessage): ILogglyMessage {
  if (logglyMessage.trace) {
    try {
      logglyMessage.trace = parse(logglyMessage.trace.toString());
    } catch (e) {
      logglyMessage.trace = undefined;
    }
  } else {
    logglyMessage.trace = undefined;
  }
  return logglyMessage;
}

export function logglyLog(logglyMessage: ILogglyMessage): void {
  const client = LogglyClient.getClient();
  logglyMessage = prepareMessage(logglyMessage);
  logglyMessage = prepareTrace(logglyMessage);
  client.log(logglyMessage);
}
