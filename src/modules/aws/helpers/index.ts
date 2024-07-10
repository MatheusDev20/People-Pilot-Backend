import { getMonthName } from 'src/helpers';

export const buildS3Path = (fileName: string, resource: string): string => {
  const date = new Date();
  return `people-pilot-${resource}/${date.getFullYear()}/${getMonthName(
    date.getMonth() + 1,
  )}/${fileName}`;
};
