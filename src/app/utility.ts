import {
  DateRange,
  PERIOD,
} from './shared/component/time-period/time-period.component';
import { subDays, subMonths, subWeeks } from 'date-fns';
import { Currency } from './shared/models/currency.interface';

export const sortByAlphabetical = (
  rate: Currency[],
  sort: 'asc' | 'desc' | '',
  baseCode: string,
) =>
  rate.sort((a, b) => {
    if (a.code === baseCode) return -1;
    if (b.code === baseCode) return 1;

    if (sort === 'asc') {
      return a.code.localeCompare(b.code);
    } else return b.code.localeCompare(a.code);
  });

export const sortByNumber = (
  rate: Currency[],
  sort: 'asc' | 'desc' | '',
  baseCode: string,
) =>
  rate.sort((a, b) => {
    if (a.code === baseCode) return -1;
    if (b.code === baseCode) return 1;

    if (sort === 'asc') {
      return a.amount - b.amount;
    } else return b.amount - a.amount;
  });

export const formatData = (quotes: any, selection: string[], source: string) =>
  Object.keys(quotes).map((date) => {
    const formattedObj = { date };
    selection.forEach((selectedKey) => {
      const matchedKey = source.concat(selectedKey);
      Object.assign(formattedObj, { [selectedKey]: quotes[date][matchedKey] });
    });

    return formattedObj;
  });

export const getPeriod = (period: PERIOD, todayDate: Date): DateRange => {
  if (period === '48h')
    return {
      startDate: subDays(todayDate, 2),
      endDate: todayDate,
    };

  if (period === '1W') {
    return {
      startDate: subWeeks(todayDate, 1),
      endDate: todayDate,
    };
  }
  return {
    startDate: subMonths(todayDate, 1),
    endDate: todayDate,
  };
};
