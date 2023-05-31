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

export const formatDateToDbType = (dateStr: string) => {
  const dtStr = dateStr as string;
  const [day, month, year] = dtStr.split('/');
  return new Date(Number(year), Number(month) - 1, Number(day));
};

export const isoToLocale = (date: Date) => date.toLocaleDateString('pt-BR');
