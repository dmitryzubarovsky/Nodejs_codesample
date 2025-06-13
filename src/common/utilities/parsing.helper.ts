import { TransformFnParams } from 'class-transformer';
import { DateTime } from 'luxon';
import { BooleanEnum } from '../enums';

export function parseDateTime(fnParams: TransformFnParams): Date {
  return DateTime.fromISO(fnParams.value).toJSDate();
}

export function parseBoolean(fnParams: TransformFnParams): unknown {
  const { value, } = fnParams;
  switch (value) {
  case BooleanEnum.TRUE:
    return true;
  case BooleanEnum.FALSE:
    return false;
  default:
    return value;
  }
}

export function parsePrice(fnParams: TransformFnParams): number {
  return parseInt(fnParams.value.replace('.', ''), 10);
}

export function parseStringToInt(fnParams: TransformFnParams): number {
  return parseInt(fnParams.value);
}
