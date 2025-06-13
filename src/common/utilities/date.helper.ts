import { DateTime } from 'luxon';

import { DateUnitEnum } from '../enums';
import { IDateRange } from './interface';

export function getCurrentDateRange(unit: DateUnitEnum): IDateRange {
  const now = DateTime.now();
  return { startDate: now.startOf(unit).toJSDate(), endDate: now.endOf(unit).toJSDate(), };
}

export function getLastDateRange(unit: DateUnitEnum): IDateRange {
  const now = DateTime.now();
  let days;
  switch (unit) {
  case DateUnitEnum.WEEK:
    const daysWeek = 7;
    days = daysWeek;
    break;
  case DateUnitEnum.MONTH:
    days = now.daysInMonth;
    break;
  case DateUnitEnum.YEAR:
    days = now.daysInYear;
    break;
  }
  const lastDate = now.minus({ days, });
  return { startDate: lastDate.startOf(unit).toJSDate(), endDate: lastDate.endOf(unit).toJSDate(), };
}

export function getDateUnit(unit: DateUnitEnum): number {
  return DateTime.now().get(unit as keyof DateTime);
}
