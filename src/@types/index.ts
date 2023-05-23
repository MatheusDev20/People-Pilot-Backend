export type StorageManager = {
  persist(file: Express.Multer.File, resource: string): Promise<string>;
};

export type AvatarProfile = Express.Multer.File;
