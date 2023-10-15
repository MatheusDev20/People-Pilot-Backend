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
  login(data: LoginDTO): Promise<JwtData>;
  refresh(refreshToken: string): Promise<JwtData>;
};

export type LoggerFunctions = {
  generateJwtLog(userId: string): void;
  expiredCookie(ipAddress: any, userAgent: string): void;
  sucessFullLogin(id: string): void;
  failedAttempt(errMsg: any, ipAddress: any, userAgent: string): void;
};

export type ValidColumn<T> = keyof T;
