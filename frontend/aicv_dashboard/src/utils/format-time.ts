import type { Dayjs } from 'dayjs';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

// ----------------------------------------------------------------------

dayjs.extend(duration);
dayjs.extend(relativeTime);

// ----------------------------------------------------------------------

export type DatePickerFormat =
  | Dayjs
  | Date
  | string
  | number
  | null
  | undefined;

/**
 * Docs: https://day.js.org/docs/en/display/format
 */
export const formatStr = {
  dateTime: 'DD MMM YYYY h:mm a', // 17 Apr 2024 12:00 am
  dateView: 'DD/MM/YYYY', // 17/04/2024
  // dateValue: 'YYYY-MM-DD', // 2024-04-17
  time: 'hh:mm', // 12:00 am
  // split: {
  //   dateTime: 'DD/MM/YYYY h:mm a', // 17/04/2024 12:00 am
  //   date: 'DD/MM/YYYY', // 17/04/2024
  // },
  // paramCase: {
  //   dateTime: 'DD-MM-YYYY h:mm a', // 17-04-2024 12:00 am
  //   date: 'DD-MM-YYYY', // 17-04-2024
  // },
};

// export function todayValue(format?: string) {
//   return dayjs(new Date())
//     .startOf('day')
//     .format(format ?? formatStr.dateValue);
// }

// export function todayView(format?: string) {
//   return dayjs(new Date())
//     .startOf('day')
//     .format(format ?? formatStr.dateView);
// }

// export function thirtyDayBefore(date: string, format?: string) {
//   const today = dayjs(date);

//   const endDate = today.subtract(30, 'day');
//   return endDate.format(format ?? formatStr.dateValue);
// }

// ----------------------------------------------------------------------

/** output: 17 Apr 2024 12:00 am
 */
export function fDateTime(date: DatePickerFormat, format?: string) {
  if (!date) {
    return null;
  }

  const isValid = dayjs(date).isValid();

  return isValid
    ? dayjs(date).format(format ?? formatStr.dateTime)
    : 'Invalid time value';
}

// ----------------------------------------------------------------------

/** output: 17 Apr 2024
 */
export function fDate(date: DatePickerFormat, format?: string) {
  if (!date) {
    return null;
  }

  const isValid = dayjs(date).isValid();

  return isValid
    ? dayjs(date).format(format ?? formatStr.dateView)
    : 'Invalid time value';
}

// ----------------------------------------------------------------------

/** output: 12:00 am
 */
export function fTime(date: DatePickerFormat, format?: string) {
  if (!date) {
    return null;
  }

  const isValid = dayjs(date).isValid();

  return isValid
    ? dayjs(date).format(format ?? formatStr.time)
    : 'Invalid time value';
}

// // ----------------------------------------------------------------------

// /** output: 1713250100
//  */
// export function fTimestamp(date: DatePickerFormat) {
//   if (!date) {
//     return null;
//   }

//   const isValid = dayjs(date).isValid();

//   return isValid ? dayjs(date).valueOf() : 'Invalid time value';
// }

// // ----------------------------------------------------------------------

// /** output: a few seconds, 2 years
//  */
// export function fToNow(date: DatePickerFormat) {
//   if (!date) {
//     return null;
//   }

//   const isValid = dayjs(date).isValid();

//   return isValid ? dayjs(date).toNow(true) : 'Invalid time value';
// }

// export function tDateTime(timestamp?: number | null, format?: string) {
//   if (!timestamp) {
//     return null;
//   }

//   const isValid = dayjs.unix(timestamp).isValid();

//   return isValid
//     ? dayjs.unix(timestamp).format(format ?? formatStr.dateTime)
//     : 'Invalid time value';
// }

// export function tTime(timestamp: number | null, format?: string) {
//   if (!timestamp) {
//     return null;
//   }

//   const isValid = dayjs.unix(timestamp).isValid();

//   return isValid
//     ? dayjs.unix(timestamp).format(format ?? formatStr.time)
//     : 'Invalid time value';
// }

// 00:00 -> Sun Nov 24 2024 00:00:00 GMT+0700
export function cTimeToDate(timeString: string) {
  const date = new Date();

  const [hours, minutes] = timeString.split(':').map(Number);

  date.setHours(hours, minutes, 0, 0);

  return date;
}

export const stripTime = (date: Date | undefined) => {
  const d = date ?? new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

// convert seconds -> "xh ym zs"
export function secondsToHMS(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0s';

  seconds = Math.trunc(seconds);

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const parts: string[] = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  if (s > 0 || parts.length === 0) parts.push(`${s}s`);

  return parts.join(' ');
}

export const formatTimeHHMMSS = (sec: number): string => {
  const s = Math.floor(sec);
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;

  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0'),
  ].join(':');
};
