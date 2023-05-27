import { LoginDTO } from 'src/modules/authentication/DTOs/login-controller.dto';
import { JwtData } from 'src/modules/security/DTOs/jwt/jwt-dto';

/**
 * Folders to be created on S3
 */
export type FileAppResources = 'employee_avatar' | 'another_resource';

export type StorageManager = {
  persist(file: Express.Multer.File, resource: FileAppResources): Promise<string>;
};

export type AvatarProfile = Express.Multer.File;

export type Authentication = {
  signIn(data: LoginDTO): Promise<JwtData>;
};
