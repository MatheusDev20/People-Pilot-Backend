export const buildS3Path = (fileName: string, resource: string): string => {
  const date = new Date();
  return `stx-s3-storage-${resource}/${date.getFullYear()}/${date.getMonth() + 1}/${fileName}`;
};
