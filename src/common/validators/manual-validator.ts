import { BadRequestException } from '@nestjs/common';
import { isEmail, isEmpty, isNotEmpty, isString } from 'class-validator';
import { DateTime } from 'luxon';

export function mustBeNotEmpty(value: unknown, key: string): void {
  if (!isNotEmpty(value)) {
    throw new BadRequestException(`${key} should not be empty`);
  }
}

export function mustBeString(value: unknown, key: string): void {
  if (!isString(value)) {
    throw new BadRequestException(`${key} must be a string`);
  }
}

export function mustBeEmail(value: unknown, key: string): void {
  if (!isEmail(value)) {
    throw new BadRequestException(`${key} must be a valid email`);
  }
}

export function dateRangeValid(startDate: Date, endDate: Date): void {
  if (isNotEmpty(startDate) === true && isNotEmpty(endDate) === false ||
    isNotEmpty(startDate) === false && isNotEmpty(endDate) === true
  ) {
    throw new BadRequestException('startDate and endDate must be empty or not empty at the same time');
  }
}

export function maxDateRange(startDate: Date, endDate: Date, maxDuration: number): void {
  const luxonStartDate = DateTime.fromJSDate(startDate);
  const luxonEndDate = DateTime.fromJSDate(endDate);
  const msInDay = 1000 * 3600 * 24;
  const duration = luxonEndDate.diff(luxonStartDate).milliseconds / msInDay;
  if (duration > maxDuration) {
    throw new BadRequestException(`the date range must be less then ${maxDuration} days`);
  }
}

export function validateCredentials(username: string, password: unknown): void {
  mustBeString(username, 'username');
  mustBeEmail(username, 'username');
  mustBeString(password, 'password');
}

export function mustBeEmpty(value: unknown, key: string): void {
  if (!isEmpty(value)) {
    throw new BadRequestException(`${key} should be empty`);
  }
}

export function isDefined(value: unknown): boolean {
  return value !== null && value !== undefined;
}
