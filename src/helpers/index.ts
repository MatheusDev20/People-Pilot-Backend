import { Request } from 'express';

export const getClientIp = (request: Request) => {
  const forwardedFor = request.headers['x-forwarded-for'];
  if (forwardedFor) {
    // Extract the first IP address in the X-Forwarded-For header
    const ips = forwardedFor[0].split(',');
    return ips[0].trim();
  }
  return request.ip;
};

export const isoToLocale = (date: Date, locale: string) =>
  date.toLocaleDateString(locale);

export function getMonthName(monthNumber) {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const index = monthNumber - 1;
  if (index >= 0 && index < 12) {
    return monthNames[index];
  } else {
    return 'Invalid month number';
  }
}
