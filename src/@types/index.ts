export type StorageManager = {
  persist(file: string): Promise<string>;
};
